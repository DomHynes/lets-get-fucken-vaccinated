import { router } from '@trpc/server'
import superjson from 'superjson'
import { Context } from '../../utils/context'
import prisma from '../../utils/prisma'
import { batchRouter } from './batch'
import { string, z } from 'zod'
import { Prisma } from '.prisma/client'

export const appRouter = router<Context>()
	.transformer(superjson)
	.query('centres', {
		resolve() {
			return prisma.centre.findMany({
				select: {
					id: true,
					name: true,
					appointments: {
						where: {
							available: true,
							time: { gt: new Date() },
						},
						orderBy: {
							time: 'asc',
						},
						take: 40,
					},
				},
				orderBy: [
					{
						name: 'asc',
					},
				],
			})
		},
	})
	.query('topcentres', {
		resolve() {
			return prisma.centre.findMany({
				take: 10,
				orderBy: {
					appointments: {
						_count: 'desc',
					},
				},
				select: {
					name: true,
					appointments: {
						take: 10,
						where: {
							available: true,
							time: { gt: new Date() },
						},
						orderBy: {
							time: 'asc',
						},
					},
				},
			})
		},
	})
	.query('localitiesForPostcode', {
		input: z.string().length(4),
		resolve({ input: postcode }) {
			return prisma.postcode.findMany({ where: { postcode } })
		},
	})
	.query('centresForLocalityId', {
		input: z.string(),
		async resolve({ input: id }) {
			// const locality = await prisma.centre.findUnique({where: {id}})

			const [locality] = await prisma.$queryRaw`
			    SELECT "public"."st_x"(p.location::geometry) as lat, "public"."st_y"(p.location::geometry) as lng
			    FROM "Postcode" as p
			    WHERE p.id = ${id}
			`
			console.warn({ locality })
			const a: { id: string; name: string; distance: number }[] =
				await prisma.$queryRawUnsafe(`

			    SELECT
			        c.id,
                    c.name,
			        "public"."st_distance"('SRID=4326;POINT(  ${locality.lat} ${locality.lng} )'::geography, c.location ) as distance
			    FROM "Centre" as c
			    ORDER BY distance asc
                LIMIT 10
			`)

			// return prisma.$queryRaw`
			//     FROM "Postcode" as p
			//     SELECT p.name, "public"."st_distance( p.location, c.location )
			//     WHERE p.id = ${id}
			//     JOIN "Centre" as c
			// `

			return a
		},
	})
	.merge('batch', batchRouter)

// export type definition of API
export type AppRouter = typeof appRouter
