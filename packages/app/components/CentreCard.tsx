import tw, { styled } from 'twin.macro'
import { Appointment } from '.prisma/client'

const Card = styled.div({
	...tw`flex flex-col p-10 rounded shadow`,
})

const CardHeader = styled.div(
	tw`flex flex-col items-start md:space-x-5 md:flex-row`,
)
const CardHeaderText = styled.p(tw`text-lg font-bold`)
const CardHeaderSubtitle = styled.p(tw``)

const StyledAppointment = styled.span({
	...tw`flex-shrink-0 p-3 font-bold text-white rounded bg-gradient-to-br`,
	variants: {
		pfizer: {
			true: tw`from-pink-400 to-blue-600`,
		},
		az: {
			true: tw`from-red-400 to-blue-600`,
		},
	},
})
const AppointmentWrapper = styled.div(
	tw`flex flex-row gap-2 overflow-x-auto md:flex-wrap`,
)

const CentreCard = (props: { name: string; appointments: Appointment[] }) => {
	return (
		<Card>
			<CardHeader>
				<CardHeaderText>{props.name}</CardHeaderText>{' '}
				{!!props.appointments.length && (
					<CardHeaderSubtitle>
						{props.appointments.length} appointments
					</CardHeaderSubtitle>
				)}
			</CardHeader>

			<AppointmentWrapper>
				{props.appointments.map(a => (
					<StyledAppointment pfizer>
						{new Date(a.time).toLocaleString('en-AU', {
							dateStyle: 'medium',
							timeStyle: 'short',
						})}
					</StyledAppointment>
				))}
			</AppointmentWrapper>
		</Card>
	)
}

export default CentreCard
