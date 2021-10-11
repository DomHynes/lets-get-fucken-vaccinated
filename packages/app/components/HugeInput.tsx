import React, { ComponentProps, ReactElement } from 'react'
import tw, { styled } from 'twin.macro'

interface Props {}

const _HugeInput = styled.input({
	...tw`w-screen text-center text-9xl focus:outline-none`,
})

export default function HugeInput({
	...rest
}: Props &
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>) {
	return <_HugeInput placeholder={'3000'} {...rest} />
}
