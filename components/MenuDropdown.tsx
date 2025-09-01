import { Dropdown } from "flowbite-react"
import { HiEllipsisVertical } from "react-icons/hi2"
import { IoTrashOutline } from "react-icons/io5"
import { LuRefreshCw } from "react-icons/lu"

interface MenuDropdownProps {

  running: boolean

  noRefresh: boolean

  doRefresh : () => void

  doRemove: () => void
}

export default function MenuDropdown({ running, noRefresh, doRefresh, doRemove }: MenuDropdownProps) {

  return (
    <div onClick={e => e.stopPropagation()}>
      <Dropdown label="" disabled={ running }
        renderTrigger={() =>
        <span className="rounded-full block hover:bg-gray-200 p-2 cursor-pointer">
          <HiEllipsisVertical className="size-5" />
        </span>}>

        <Dropdown.Item onClick={ doRefresh } disabled={ noRefresh }
          className={`min-w-40 ${ noRefresh ? 'text-gray-400 cursor-not-allowed' : '' }`}>
          <LuRefreshCw className='size-4 me-2' /> Refresh
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item onClick={ doRemove } disabled={ running }
          className={running ? 'text-gray-400 cursor-not-allowed' : ''}>
          <IoTrashOutline className='size-4 me-2' /> Delete
        </Dropdown.Item>
      </Dropdown>
    </div>
  )
}
