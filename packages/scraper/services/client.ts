import { createTRPCClient } from '@trpc/client'
import config from 'config'
import fetch from 'isomorphic-unfetch'
import type { AppRouter } from '@lets-get-vaccinated/web/server/routers/app'
import superjson from 'superjson'

export const client = createTRPCClient<AppRouter>({
	url: config.get('backend.url'),
	fetch,
	transformer: superjson,
	headers: {
		authorization: `Bearer ${config.get('backend.token')}`,
	},
})
