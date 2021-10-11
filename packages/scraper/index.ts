import dotenv from 'dotenv'
import { Page } from 'puppeteer'
if (process.env.NODE_ENV === 'production') dotenv.config({ path: '../.env' })

import {
	bypassCaptcha,
	clickThroughPersonalInfo,
	clickThroughVax,
	getAudioSrc,
	transcribeCaptcha,
	getProviderIds,
	init,
	initAudioPage,
	login,
	processProvider,
	verifyEmail,
	processCentres,
} from './utils/phases'

let page: Page

const main = async () => {
	const out = await init()
	const browser = out.browser
	page = out.page

	await page.goto('https://portal.cvms.vic.gov.au/covidvaccine-booking-slots/')
	console.log('logging in')
	await login({ page })
	console.log('logged in')
	await verifyEmail({ page })
	console.log('verified email')

	let passedCaptcha = false
	let captchaText
	while (!passedCaptcha) {
		console.log('attempting captcha')
		const src = await getAudioSrc({ page })

		const audioPage = await initAudioPage({ browser })
		captchaText = await transcribeCaptcha({ audioPage, src })

		await bypassCaptcha({ page, captchaText })
		if (!page.url().endsWith('/book/')) {
			passedCaptcha = true
		}
	}

	await clickThroughPersonalInfo({ page })
	await clickThroughVax({ page })

	const { centres, providers } = await getProviderIds({ page })
	await processCentres({ centres })

	while (true) {
		for (const provider of providers) {
			await processProvider({ page, provider })
		}
	}
}

main().catch(e => {
	console.error(e)
	page.screenshot({ path: '/usr/src/app/error.png' }).finally(() => {
		console.error(e)
		process.exit(1)
	})
})
