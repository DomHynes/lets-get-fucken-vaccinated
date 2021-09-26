import type { AppRouter } from '@lets-get-vaccinated/web'
import { createTRPCClient } from '@trpc/client'
import config from 'config'
import fetch from 'isomorphic-unfetch'

export const client = createTRPCClient<AppRouter>({
	url: config.get('backend.url'),
	fetch,
})
