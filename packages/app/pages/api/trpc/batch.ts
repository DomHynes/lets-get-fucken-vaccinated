import { router } from '@trpc/server'
import { z } from 'zod'
import prisma from '../../../utils/prisma'

export const batchRouter = router()
	.mutation('centres', {
		input: z
			.object({
				id: z.string(),
				name: z.string(),
			})
			.array(),
		resolve: async ({ input }) => {
			for (const centre of input) {
				await prisma.centre.upsert({
					create: centre,
					where: { id: centre.id },
					update: { name: centre.name },
				})
			}
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

			return prisma.appointment.findMany()
		},
	})
