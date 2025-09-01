import { ReactNode } from "react"
import {
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime
} from "flowbite-react"
import { HiCalendar } from "react-icons/hi"

interface CustomTimelineItemProps {
  time: string
  body: ReactNode
}

export default function CustomTimelineItem({ time, body }: CustomTimelineItemProps) {

  return (
    <TimelineItem>
      <TimelinePoint icon={ HiCalendar } />
      <TimelineContent>
        <TimelineTime className="text-xs">{ time }</TimelineTime>
        <TimelineBody className="text-sm">
          { body }
        </TimelineBody>
      </TimelineContent>
    </TimelineItem>
  )
}
