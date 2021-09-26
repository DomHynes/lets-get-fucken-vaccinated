import { inferAsyncReturnType } from '@trpc/server'
import { verify } from 'jsonwebtoken'
import config from 'config'
import * as trpcNext from '@trpc/server/adapters/next'

export async function createContext({
	req,
}: trpcNext.CreateNextContextOptions) {
	if (req.headers.authorization) {
		const [, token] = req.headers.authorization?.split(' ')
		if (verify(token, process.env.JWT_SECRET as string)) {
			return {
				isAdmin: true,
			}
		}
	}

	return {
		isAdmin: false,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
