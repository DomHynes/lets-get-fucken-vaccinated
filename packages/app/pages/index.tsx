import React from 'react'
import tw, { styled } from 'twin.macro'
import { AppRouter } from '..'
import CentreCard from '../components/CentreCard'

import { createReactQueryHooks } from '@trpc/react'

const trpc = createReactQueryHooks<AppRouter>()

const Container = styled.div({
	...tw`container flex flex-col justify-center min-h-screen gap-10 mx-auto `,
})

const Header = styled.h1({
	...tw`text-5xl font-bold text-center md:text-left md:text-7xl lg:text-8xl`,
	variants: {
		hasGradient: {
			true: tw`text-5xl text-transparent from-pink-400 to-blue-600 bg-gradient-to-br bg-clip-text md:text-8xl lg:text-9xl`,
		},
	},
})

const Subtitle = styled.p(tw`font-semibold `)

const Fadein = styled.div({
	...tw`transition-all ease-in-out opacity-0 position[relative] top[300px] transition-duration[400ms]`,
	variants: {
		show: {
			true: tw`top-0 opacity-100`,
		},
	},
})

const IndexPage = () => {
	const { data } = trpc.useQuery(['centres'], {
		ssr: false,
		refetchInterval: 10000,
	})

	return (
		<Container>
			<div>
				<Header>let's get fucken</Header>
				<Header hasGradient>VACCINATED</Header>
			</div>

			<Subtitle>
				Currently this only shows Pfizer appointments available at State
				Vaccination Centres over the next month.
			</Subtitle>

			<Fadein show={!!data}>
				{data?.map(d => (
					<CentreCard name={d.name} appointments={d.appointments} />
				))}
			</Fadein>
		</Container>
	)
}

export default IndexPage
