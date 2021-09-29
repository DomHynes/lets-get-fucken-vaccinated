import React, { useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import { AppRouter } from '..'
import CentreCard from '../components/CentreCard'

import { createReactQueryHooks } from '@trpc/react'

const trpc = createReactQueryHooks<AppRouter>()

const Container = styled.div({
	...tw`container flex flex-col h-screen gap-10 px-4 mx-auto mt-10 duration-700 ease-in-out transform`,
})

const Header = styled.h1({
	...tw`text-4xl font-bold text-center md:text-left sm:text-5xl md:text-7xl lg:text-8xl`,
	variants: {
		hasGradient: {
			true: tw`text-transparent drop-shadow-2xl filter from-pink-400 to-blue-600 bg-gradient-to-br bg-clip-text sm:text-6xl md:text-8xl lg:text-9xl`,
		},
	},
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
				<div>
					<Header>let's get fucken</Header>
					<Header hasGradient>VACCINATED</Header>
				</div>
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
