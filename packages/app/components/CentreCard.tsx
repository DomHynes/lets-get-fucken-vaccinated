import tw, { styled } from 'twin.macro'
import { Appointment } from '.prisma/client'

const Card = styled.div({
	...tw`p-10 rounded shadow`,
})

const CardHeader = styled.h1(tw`text-lg font-bold`)
const StyledAppointment = styled.span(
	{
		...tw`p-3 font-bold text-white rounded bg-gradient-to-br`,
		variants: {
			pfizer: {
				true: tw`from-pink-400 to-blue-600`
			}, 
			az: {
				true: tw`from-red-400 to-blue-600`
			}
		}
	}
)
const AppointmentWrapper = styled.div(tw`flex flex-row flex-wrap gap-2 `)

const CentreCard = (props: { name: string; appointments: Appointment[] }) => {
	return (
		<Card>
			<CardHeader>{props.name}</CardHeader>

			<AppointmentWrapper>
				{props.appointments.map(a => (
					<StyledAppointment pfizer>
						{new Date(a.time).toLocaleString()}
					</StyledAppointment>
				))}
			</AppointmentWrapper>
		</Card>
	)
}

export default CentreCard
