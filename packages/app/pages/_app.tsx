import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { createReactQueryHooks } from '@trpc/react'
import { AppProps } from 'next/app'
import superjson from 'superjson'
import { AppRouter } from '..'
import globalStyles from '../styles/globalStyles'

const trpc = createReactQueryHooks<AppRouter>()

const App = ({ Component, pageProps }: AppProps) => {
	globalStyles()
	return <Component {...pageProps} />
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		const isServer = typeof window === 'undefined'
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		let url

		if (isServer) {
			url = process.env.VERCEL_STATIC_URL
				? `https://${process.env.VERCEL_STATIC_URL}/api/trpc`
				: 'http://localhost:3000/api/trpc'
		} else {
			url = '/api/trpc'
		}

		return {
			url,
			transformer: superjson,
			queryClientConfig: {
				defaultOptions: { queries: { refetchOnWindowFocus: false } },
			},
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		}
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(App)
