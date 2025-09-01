import { BadgeState, CustomBadge, getBadgeState } from "@/components/fragments/CustomBadge"
import { FileStatus } from "@/libs/FileStatus"
import { DropdownItem } from "flowbite-react"
import { FileStatusType } from "./MyFilesRom"

interface DropdownItemStatusProps {
  status: FileStatusType
  onClick: () => void
  disabled?: boolean
}

const getItemStyle = (status: FileStatusType): string => status === FileStatus.PENDING 
  ? 'bg-gray-600'
  : status === FileStatus.PROCESSED
    ? 'bg-green-600'
    : status === FileStatus.ERROR
      ? 'bg-red-600'
      : status === 'ALL'
        ? 'bg-slate-800' 
        : 'bg-orange-400'

export default function DropdownItemStatus({ status, onClick , disabled }: DropdownItemStatusProps) {

  return (
    <DropdownItem onClick={ onClick } className="w-full" disabled={ disabled }>
      <span className={`size-3 rounded-full me-2 ${ getItemStyle(status) }`}></span>
      <CustomBadge statusText={ status } state={ status === 'ALL' ? BadgeState.OTHER : getBadgeState(status) } />
    </DropdownItem>
  )
}
