import config from 'config'
import * as imap from 'imap-simple'

export const getEmails = async () => {
	const connection = await imap.connect({
		imap: {
			user: config.get('email.user'),
			password: config.get('email.password'),
			host: config.get('email.host'),
			port: config.get('email.port'),
			tls: true,
		},
	})

	await connection.openBox('INBOX')

	const searchCriteria = ['UNSEEN']

	const inbox = await connection.search(searchCriteria, {
		bodies: ['HEADER', 'TEXT'],
		markSeen: false,
	})

	const mail = inbox
		.reverse()
		.find(result =>
			result.parts.find(
				part =>
					part.body.subject ==
					'Department of Health Victoria account email verification code',
			),
		)

	if (!mail) throw new Error('Could not find DoH email')

	const body = mail.parts.find(p => p.which === 'TEXT')?.body
	const bodyParsed = Buffer.from(body, 'base64').toString('ascii')
	const results = new RegExp(/Your code is: (\d{6})/).exec(bodyParsed)
	if (!results) throw new Error('Could not parse code')
	const [, code] = results
	return code
}
