import type { AppRouter } from '@lets-get-vaccinated/web'
import { createTRPCClient } from '@trpc/client'
import fetch from 'isomorphic-unfetch'

export const client = createTRPCClient<AppRouter>({
	url: client.get('backend.url'),
	fetch,
})
