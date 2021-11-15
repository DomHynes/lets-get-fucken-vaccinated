import React, { useMemo } from 'react'
import tw, { styled } from 'twin.macro'
import { AppRouter } from '..'
import CentreCard from '../components/CentreCard'
import { Hero } from '../components/Hero'
import { trpc } from '../hooks/trpc'

const Container = styled.div({
	...tw`container flex flex-col justify-center h-screen gap-10 mx-auto px-4 align-items[center]`,
})

const Subtitle = styled.p(tw`p-2 font-semibold md:text-xl`)

const Footer = styled.div(tw`my-10 text-center`)

const IndexPage = () => {
	return (
		<Container>
			<Hero />
			<Subtitle>
				This site used to show Pfizer appointments available at Victorian State
				Vaccination Centres.
			</Subtitle>
			<Footer>
				made with love and fury by{' '}
				<a href="https://twitter.com/domhynes" tw="underline font-bold">
					domhynes
				</a>
			</Footer>
		</Container>
	)
}

export default IndexPage
