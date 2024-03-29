import { launch, Page, Browser, ElementHandle } from 'puppeteer'
import { getEmails } from '../services/emails'
import { convertSpeechToText } from '../services/speech-to-text'
import { uploadToBucket } from '../services/storage'

import { readFileSync, readdirSync, unlinkSync } from 'fs'
import { AxiosError } from 'axios'
import { parse } from 'date-fns'
import { client } from '../services/client'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['info', 'query'] })

export const init = async () => {
	const browser = await launch({ headless: true, args: ['--no-sandbox'] })

	const [page] = await browser.pages()

	page.setViewport({ width: 1920, height: 1080 })
	page.on('dialog', async dialog => {
		console.log(dialog.message())
		await dialog.dismiss()
	})

	return { browser, page }
}

export const login = async ({ page }: { page: Page }) => {
	await page.waitForSelector('#email')

	await page.type('#email', 'haleigh.spencer30@ethereal.email')
	await page.type('#password', 'MjT2aKxXGjQf7YzvjB')

	await page.waitForSelector('#next')
	await page.click('#next')
}

export const verifyEmail = async ({ page }: { page: Page }) => {
	console.log('waiting for verify email button')
	await page.waitForSelector('#ReadOnlyEmail_ver_but_send')
	await page.click('#ReadOnlyEmail_ver_but_send')
	console.log('clicked email verify button')

	await page.waitForTimeout(5000)
	console.log('getting email code')
	const code = await getEmails()
	console.log('got email code')

	const verifyInput = await page.waitForSelector('#ReadOnlyEmail_ver_input')
	if (!verifyInput) throw new Error('Could not find email verifyInput')
	await verifyInput.type(code)

	await page.waitForTimeout(1000)

	await page.waitForSelector('#ReadOnlyEmail_ver_but_verify')
	await page.click('#ReadOnlyEmail_ver_but_verify')

	await page.waitForSelector('#continue')
	await page.waitForTimeout(1000)
	await page.click('#continue')

	await page.waitForTimeout(5000)
	console.log('going to booking page')
	await page.goto('https://portal.cvms.vic.gov.au/book/')
	await page.waitForTimeout(3000)
}

export const getAudioSrc = async ({ page }: { page: Page }) => {
	const audioRef = await page.waitForSelector('audio')
	if (!audioRef) {
		throw new Error('Could not find captcha ref')
	}
	let src = await audioRef.evaluate(p => p.getAttribute('src') as string)
	src = src.replace('../', '')

	return src
}

export const initAudioPage = async ({ browser }: { browser: Browser }) => {
	const audioPage = await browser.newPage()

	//@ts-ignore
	await audioPage._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: '/tmp/',
	})

	return audioPage
}

export const transcribeCaptcha = async ({
	audioPage,
	src,
}: {
	audioPage: Page
	src: string
}) => {
	try {
		await audioPage.goto(`https://portal.cvms.vic.gov.au/${src}`)
	} catch (e) {}
	await audioPage.waitForTimeout(3000)
	await audioPage.close()

	const files = readdirSync('/tmp')
	const filePath = files.find(file => file.endsWith('.wav'))
	const fileBuffer = readFileSync(`/tmp/${filePath}`)
	unlinkSync(`/tmp/${filePath}`)

	const filename = await uploadToBucket(Buffer.from(fileBuffer))
	console.log(filename)

	const result = await convertSpeechToText(
		`gs://text-to-speech-vaccine/${filename}`,
	)

	return result
}

export const bypassCaptcha = async ({
	page,
	captchaText,
}: {
	page: Page
	captchaText: string
}) => {
	await page.waitForSelector('input[type=text]')
	await page.focus('input[type=text]')
	await page.type('input[type=text]', captchaText)
	await page.keyboard.press('Enter')
	await page.waitForTimeout(5000)
}

export const clickThroughPersonalInfo = async ({ page }: { page: Page }) => {
	await page.waitForTimeout(5000)
	await page.waitForSelector('input.btn.btn-primary.submit-btn')
	await page.click('input.btn.btn-primary.submit-btn')

	await page.waitForTimeout(5000)
	await page.waitForSelector('input.btn.btn-primary.submit-btn')
	await page.click('input.btn.btn-primary.submit-btn')
}

export const clickThroughVax = async ({ page }: { page: Page }) => {
	await page.waitForSelector('#ms_otherallergy_1')
	await page.click('#ms_otherallergy_1')

	await page.waitForSelector('#ms_othervac_allergy_1')
	await page.click('#ms_othervac_allergy_1')

	await page.waitForSelector('#ms_covidvac_history_1')
	await page.click('#ms_covidvac_history_1')
	await page.focus('#ms_covidvac_history_1')

	await page.keyboard.press('Tab')
	await page.keyboard.press('ArrowDown')

	await page.waitForSelector('input.btn.btn-primary.submit-btn')
	await page.click('input.btn.btn-primary.submit-btn')
}

export const getProviderIds = async ({ page }: { page: Page }) => {
	await page.waitForSelector('tbody')
	let providers = await page.evaluate(() => {
		const uuidRegex = /[\w\d]+-[\w\d]+-[\w\d]+-[\w\d]+-[\w\d]+/g

		return Array.from(document.querySelectorAll('.providerrows'), e => ({
			id: e.getAttribute('onclick')?.match(uuidRegex)?.[0] as string,
			name: e.childNodes[1].childNodes[1].textContent as string,
			onClick: e.getAttribute('onclick') as string,
		}))
	})

	const centres: { [id: string]: string } = {}

	providers.forEach(f => (centres[f.id] = f.name))

	return { centres, providers }
}

export const processProvider = async ({
	page,
	provider,
}: {
	page: Page
	provider: {
		id: string
		name: string
		onClick: string
	}
}) => {
	console.log(`handling onclick for: ${provider.id}`)
	await page.evaluate(provider.onClick)
	await page.waitForTimeout(3000)
	let appointments: string[] = []
	let nextButton: ElementHandle<Element> | null

	do {
		nextButton = null
		try {
			nextButton = await page.waitForSelector('#vras_btn_next_page')
			console.log('found button')
			const disabled = await nextButton?.evaluate(
				e => e.getAttribute('disabled') === '',
			)

			if (disabled) {
				console.log('button disabled')
				nextButton = null
			}
		} catch (e) {
			console.log(`no next button for: ${provider.id}`)
		}

		console.log('finding appointments on page')
		const appointmentsPage = await page.evaluate(() =>
			Array.from(
				document.querySelectorAll('.vrasTimeSlot'),
				e => e.textContent as string,
			),
		)

		appointments.push(...appointmentsPage)

		if (!nextButton) {
			console.log('no next page')
		} else {
			console.log('going to next page')
			await nextButton.click()
			await page.waitForTimeout(1000)
		}
	} while (nextButton)

	const centreAppointments = appointments.map(a =>
		parse(a, 'dd-MM-yyyy hh:mm a', new Date()),
	)

	console.log(
		`found ${centreAppointments.length} appointments for ${provider.id}`,
	)

	await updateAppointmentsForCentre({
		centreId: provider.id,
		times: centreAppointments,
	})

	await page.waitForSelector('.btn.btn-default.submit-btn.VICbtn-ghost')
	await page.click('.btn.btn-default.submit-btn.VICbtn-ghost')
	await page.waitForTimeout(3000)
}

export const updateAppointmentsForCentre = async ({
	centreId,
	times,
}: {
	centreId: string
	times: Date[]
}) => {
	await prisma.appointment.updateMany({
		data: {
			available: false,
		},
		where: {
			centreId,
			time: {
				notIn: times,
			},
		},
	})
	await prisma.appointment.updateMany({
		data: {
			available: true,
		},
		where: {
			centreId,
			time: {
				in: times,
			},
		},
	})

	await prisma.appointment.createMany({
		data: times.map(time => ({ centreId, time, available: true })),
		skipDuplicates: true,
	})
}
export const processCentres = async ({
	centres,
}: {
	centres: {
		[id: string]: string
	}
}) => {
	const newCentres: { id: string; name: string }[] = []

	Object.entries(centres).forEach(([id, name]) => {
		newCentres.push({ id, name })
	})

	for (const centre of newCentres) {
		await prisma.centre.upsert({
			create: centre,
			where: { id: centre.id },
			update: { name: centre.name },
		})
	}
}
