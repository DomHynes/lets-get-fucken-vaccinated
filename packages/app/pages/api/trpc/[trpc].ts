import * as trpcNext from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/routers/app'
import { createContext } from '../../../utils/context'

// export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	onError({ error }) {
		console.error(error)
	},
})
