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
} from './utils/phases'

const main = async () => {
	const { browser, page } = await init()

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
		const audioPage = await initAudioPage({ browser })

		const src = await getAudioSrc({ page })
		captchaText = await transcribeCaptcha({ audioPage, src })
		await bypassCaptcha({ page, captchaText })

		if (page.url().endsWith('/book/')) {
			passedCaptcha = true
		}
	}

	await clickThroughPersonalInfo({ page })
	await clickThroughVax({ page })

	const { providers } = await getProviderIds({ page })

	for (const provider of providers) {
		await processProvider({ page, provider })
	}

	await page.waitForTimeout(1000000)

	await browser.close()
}

main()
