import tw, { styled } from 'twin.macro'

const Header = styled.h1({
	...tw`text-4xl font-bold text-center md:text-left sm:text-5xl md:text-7xl lg:text-8xl`,
	variants: {
		hasGradient: {
			true: tw`text-transparent drop-shadow-2xl filter from-pink-400 to-blue-600 bg-gradient-to-br bg-clip-text sm:text-6xl md:text-8xl lg:text-9xl`,
		},
	},
})

export const Hero = () => {
	return (
		<div>
			<Header>let's get fucken</Header>
			<Header hasGradient>VACCINATED</Header>
		</div>
	)
}
