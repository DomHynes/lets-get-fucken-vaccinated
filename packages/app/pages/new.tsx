import { useQuery } from 'react-query'
import { trpc } from '../hooks/trpc'
import tw, { styled } from 'twin.macro'
import CentreCard from '../components/CentreCard'
import React, { useState } from 'react'
import { Hero } from '../components/Hero'
import HugeInput from '../components/HugeInput'

const Container = styled.div({
	...tw`container mx-auto`,
})

const SuburbSelect = styled.div({
	...tw`flex flex-col justify-center p-2 text-lg font-bold text-center shadow cursor-pointer`,
})

const NewIndex = () => {
	const [postcode, setPostcode] = useState<string>()
	const { data } = trpc.useQuery(['localitiesForPostcode', postcode], {
		enabled: !!postcode,
	})

	const [selectedState, setSelectedState] = useState<string>()
	const centres = trpc.useQuery(['centresForLocalityId', selectedState], {
		enabled: !!selectedState,
	})

	return (
		<div tw="container mx-auto">
			<Hero />

			{!selectedState && (
				<HugeInput onChange={e => setPostcode(e.target.value)} />
			)}

			{!centres?.data &&
				data?.map(d => (
					<SuburbSelect onClick={() => setSelectedState(d.id)}>
						{d.locality}
					</SuburbSelect>
				))}

			{centres?.data?.map(d => (
				<SuburbSelect onClick={() => setSelectedState(d.id)}>
					{d.name}
				</SuburbSelect>
			))}
		</div>
	)
}

export default NewIndex
