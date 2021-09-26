import { router } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { Context, createContext } from '../../../utils/context'
import prisma from '../../../utils/prisma'
import { batchRouter } from './batch'

const appRouter = router<Context>()
	.query('centres', {
		resolve() {
			return prisma.centre.findMany({
				include: { appointments: true },
				where: { appointments: { every: { available: true } } },
				orderBy: [
					{
						appointments: {
							_count: 'desc',
						},
					},
					{
						name: 'asc',
					},
				],
			})
		},
	})
	.merge('batch', batchRouter)

// export type definition of API
export type AppRouter = typeof appRouter

// export API handler
export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
})
