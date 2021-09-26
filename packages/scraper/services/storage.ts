import { Storage } from '@google-cloud/storage'

const storage = new Storage()
const bucket = storage.bucket('text-to-speech-vaccine')

export const uploadToBucket = async (data: Buffer) => {
	const fileName = `${Date.now()}.wav`
	const file = bucket.file(fileName)
	await file.save(data)

	return fileName
}
