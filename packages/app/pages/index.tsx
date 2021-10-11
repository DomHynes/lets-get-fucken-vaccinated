import React, { useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import { AppRouter } from '..'
import CentreCard from '../components/CentreCard'
import { Hero } from '../components/Hero'
import { trpc } from '../hooks/trpc'

const Container = styled.div({
	...tw`container flex flex-col h-screen gap-10 px-4 mx-auto mt-10 duration-700 ease-in-out transform`,
})

const Subtitle = styled.p(tw`p-2 font-semibold md:text-xl`)

const Fadein = styled.div({
	...tw`relative flex flex-col space-y-10 duration-700 ease-in-out opacity-0`,
	variants: {
		show: {
			true: tw`opacity-100`,
		},
	},
})

const TextWrapper = styled.div({
	...tw`h-screen relative space-y-10 duration-700 ease-in-out transform width[100%]`,
	variants: {
		collapsed: {
			false: tw`top-0`,
			true: tw`h-0 -mt-48 overflow-visible top-1/2`,
		},
	},
})

const Footer = styled.div(tw`py-10 text-center`)

const IndexPage = () => {
	const { data } = trpc.useQuery(['centres'], {
		ssr: false,
		refetchInterval: 10000,
	})

	const { withAppointments, withoutAppointments } = useMemo(() => {
		const withAppointments: typeof data = []
		const withoutAppointments: typeof data = []

		data?.forEach(d => {
			d.appointments.length
				? withAppointments.push(d)
				: withoutAppointments.push(d)
		})

		return {
			withAppointments,
			withoutAppointments,
		}
	}, [data])

	return (
		<Container>
			<TextWrapper collapsed={!data}>
				<Hero />
				<Subtitle>
					This shows Pfizer appointments available at Victorian State
					Vaccination Centres over the next four weeks.
				</Subtitle>
				<Fadein show={!!data}>
					{withAppointments?.map(d => (
						<CentreCard name={d.name} appointments={d.appointments} />
					))}
					{withoutAppointments?.map(d => (
						<CentreCard name={d.name} appointments={d.appointments} />
					))}
					<Footer>
						made with love and fury by{' '}
						<a href="https://twitter.com/domhynes" tw="underline font-bold">
							domhynes
						</a>
					</Footer>
				</Fadein>
			</TextWrapper>
		</Container>
	)
}

export default IndexPage
