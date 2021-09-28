import { router, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Context } from '../../../utils/context'
import prisma from '../../../utils/prisma'

export const batchRouter = router<Context>()
	// this protects all procedures defined next in this router
	.middleware(async ({ ctx, next }) => {
		if (!ctx.isAdmin) {
			throw new TRPCError({ code: 'UNAUTHORIZED' })
		}
		return next()
	})
	.mutation('centre', {
		input: z.object({
			id: z.string(),
			name: z.string(),
		}),
		resolve: async ({ input: centre }) => {
			await prisma.centre.upsert({
				create: centre,
				where: { id: centre.id },
				update: { name: centre.name },
			})
			return prisma.centre.findMany()
		},
	})
	.mutation('appointmentsForCentre', {
		input: z.object({
			centreId: z.string(),
			times: z.string().array(),
		}),
		resolve: async ({ input }) => {
			await prisma.appointment.updateMany({
				data: {
					available: false,
				},
				where: {
					centreId: input.centreId,
				},
			})

			for (const time of input.times) {
				const parsedTime = new Date(time)
				await prisma.appointment.upsert({
					create: {
						time: parsedTime,
						centreId: input.centreId,
						available: true,
					},
					where: {
						time_centreId: {
							time: parsedTime,
							centreId: input.centreId,
						},
					},
					update: {
						available: true,
					},
				})
			}

			console.log(`updated: ${input.centreId}`)

			return prisma.appointment.findMany()
		},
	})
