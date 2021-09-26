import axios from 'axios'

const getFile = async (name: string): Promise<ArrayBuffer> => {
	const response = await axios.get(name, { responseType: 'arraybuffer' })

	return response.data
}

export default getFile
