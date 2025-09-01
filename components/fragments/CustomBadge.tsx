import { FileStatus } from "@/libs/FileStatus"

const enum BadgeState {
  PENDING, COMPLETED, ERROR, OTHER
}

interface CustomBadgeProp {
  statusText: string
  state: BadgeState
}

const getStatusStyle = (status: BadgeState): string => status === BadgeState.PENDING 
  ? 'bg-gray-100 text-gray-800'
  : status === BadgeState.COMPLETED
    ? 'bg-green-100 text-green-800'
    : status === BadgeState.ERROR
      ? 'bg-red-100 text-red-800'
      : '',

CustomBadge = ({ statusText, state }: CustomBadgeProp) => (
  <span className={ `text-xs font-medium px-2.5 py-0.5 rounded ${ getStatusStyle(state) }` }>
    { statusText }
  </span>
),

getBadgeState = (status: FileStatus) => status === FileStatus.PROCESSING
    ? BadgeState.PENDING
    : status === FileStatus.PROCESSED
      ? BadgeState.COMPLETED
      : status === FileStatus.ERROR
        ? BadgeState.ERROR
        : BadgeState.OTHER

export { BadgeState, CustomBadge, getBadgeState }
