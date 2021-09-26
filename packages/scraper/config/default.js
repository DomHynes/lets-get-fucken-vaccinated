module.exports = {
	email: {
		user: process.env.EMAIL_USER,
		password: process.env.EMAIL_PASSWORD,
		host: process.env.EMAIL_HOST,
		port: Number(process.env.EMAIL_PORT),
	},
}
