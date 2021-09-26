import { SpeechClient } from '@google-cloud/speech'

const client = new SpeechClient()

const processOption = (word: string) => {
	console.log(word)
	let newWord = word.toLowerCase()

	if (newWord === 'clinic') {
		newWord = 'quebec'
	}

	if (newWord == 'to') {
		newWord = '2'
	}

	if (newWord == 'hello') newWord = 'kilo'

	return newWord[0]
}

export const convertSpeechToText = async (gcsPath: string) => {
	const [result] = await client.recognize({
		config: {
			languageCode: 'en-US',
		},
		audio: {
			uri: gcsPath,
		},
	})

	console.log(JSON.stringify(result.results))
	if (!result.results) throw new Error('No audio results')
	let transcripts = result.results
		.map(r => r.alternatives?.map(a => a.transcript))
		.flat(Infinity)
		.join(' ')

	console.log(transcripts)

	transcripts = transcripts.replace('Fox trots', 'foxtrot')
	transcripts = transcripts.replace('Fox Trot', 'foxtrot')
	transcripts = transcripts.replace('see Eric', 'sierra')
	transcripts = transcripts.replace('X ray', 'xray')
	transcripts = transcripts.replace('x ray', 'xray')

	const processed = transcripts.split(' ').map(processOption).join('')

	return processed
}
