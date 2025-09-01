import { CustomBadge, getBadgeState } from "@/components/fragments/CustomBadge"
import { FileDetails } from "@/libs/FileDetails"
import { FileStatus } from "@/libs/FileStatus"
import { convertTimestampToLocalDate, getFileStatus } from "@/libs/helpers"
import { Dropdown, Popover, Spinner } from "flowbite-react"
import moment from "moment"
import { PiEye } from "react-icons/pi"
import { HiEllipsisVertical } from "react-icons/hi2"
import { LuRefreshCw, LuShapes } from "react-icons/lu"
import { IoTrashOutline } from "react-icons/io5"
import IconFile from "@/components/IconFile"
import { FaCheck } from "react-icons/fa6"
import { MdOutlineClose } from "react-icons/md"
import { AiOutlineLoading } from "react-icons/ai"

interface FileListItemProps {

  file: FileDetails

  runningItem: string | null

  running: boolean

  isItemSelected: (v: string) => boolean

  setShowFileCard: (v: string | null) => void

  selectItemClicked: (checked: boolean, indexId: string) => void

  handleDeleteItem: (v: string) => void

  setAddFileToCollection: (v: string | null) => void

  doReloadFile: (v: string) => void
}

export default function FileListItem({ file, running, runningItem, isItemSelected, setShowFileCard,
selectItemClicked, handleDeleteItem, setAddFileToCollection, doReloadFile }: FileListItemProps) {

  const { name, metadata, originalName, dateUploaded } = file,

  createdAtNb = parseInt(dateUploaded, 10),

  createdAtStr = convertTimestampToLocalDate(createdAtNb, true),

  itemChecked = isItemSelected(name),

  fileStatusTime = metadata ? metadata.statusChangeTimestamp : null,

  fileStatusStr = fileStatusTime ? 'Status time: ' + moment(Number(fileStatusTime) * 1000).format('lll') : '',

  fileStatus = getFileStatus(metadata),

  noRefresh = fileStatus === FileStatus.PROCESSED || fileStatus === FileStatus.ERROR,

  itemIsRunning = runningItem === name,

  statusReason = metadata ? metadata.statusReason : null,

  keywords = metadata ? metadata.keywords : null,

  textKeyword = fileStatus === FileStatus.ERROR ? statusReason : keywords

  return (
    <div key={ name } onClick={() => setShowFileCard(name)}
      className={`text-sm text-gray-700 py-2 sm:py-3 pe-2 my-1 sm:my-2 border-b rounded-lg cursor-pointer flex items-center gap-2 ${
        itemChecked ? 'bg-orange-50' : 'bg-gray-50 hover:bg-gray-100' }`}>

      <div className='w-2/3 sm:w-1/2 inline-flex items-center'>
        { itemIsRunning ? <Spinner aria-label="Running entry" className='m-2' />
        : <label className='cursor-pointer hover:bg-gray-200 px-3 py-2.5 rounded-full'
          onClick={e => e.stopPropagation()} title='Select'>
          <input
            type='checkbox'
            checked={ itemChecked }
            onChange={e => selectItemClicked(e.target.checked, name)}
            className="rounded-full cursor-pointer border-gray-300 hover:border-gray-600"
            disabled={ running || !!runningItem }
          />
        </label>}

        <IconFile filename={ originalName } className="size-4" />

        <p className="ms-2 truncate w-full" title={ originalName }>{ originalName }</p>
      </div>

      <div className="w-1/3 sm:w-1/2 inline-flex items-center justify-between gap-1">

        <div className="text-center min-w-[157px] hidden sm:block" title={ fileStatusStr }>
          <Popover
            aria-labelledby="profile-popover"
            content={
              <p className='p-4'>
                { fileStatusStr }
              </p>
            }>
            <span className='p-3 cursor-pointer'
              onClick={e => e.stopPropagation()}>
              <CustomBadge statusText={ fileStatus } state={ getBadgeState(fileStatus) } />
            </span>
          </Popover>
        </div>

        <p className="sm:hidden">
          { fileStatus === FileStatus.PROCESSED ? <FaCheck className="text-green-600" /> 
          : fileStatus === FileStatus.ERROR ? <MdOutlineClose className="text-red-600" /> 
          : fileStatus === FileStatus.PROCESSING ? <AiOutlineLoading className="animate-spin" />
          : '' }
        </p>

        <p className="text-gray-500 truncate w-full hidden sm:block" title={ textKeyword ?? '' }>
          { textKeyword }
        </p>

        <p className="text-xs text-nowrap text-zinc-500 hidden sm:block" title={ createdAtStr }>
          { moment(createdAtNb * 1000).fromNow(true) }
        </p>

        <p className="text-xs text-zinc-500 truncate w-full text-right sm:hidden" title={ createdAtStr }>
          { moment(createdAtNb * 1000).fromNow(true) }
        </p>

        <div onClick={e => e.stopPropagation()}>
          <Dropdown label="" disabled={ itemIsRunning || running }
            renderTrigger={() =>
            <span className="rounded-full block hover:bg-gray-200 p-2 cursor-pointer">
              <HiEllipsisVertical className="size-5" />
            </span>}>

            <Dropdown.Item onClick={() => setShowFileCard(name)} disabled={ itemIsRunning || running }>
              <PiEye className='size-5 me-2' /> Preview
            </Dropdown.Item>

            <Dropdown.Item onClick={() => doReloadFile(name)} 
              disabled={ noRefresh }
              className={ noRefresh ? 'text-gray-400 cursor-not-allowed' : ''}>
              <LuRefreshCw className='size-4 me-2' /> Refresh status
            </Dropdown.Item>

            <Dropdown.Item onClick={() => setAddFileToCollection(name)} 
              disabled={ itemIsRunning || fileStatus !== FileStatus.PROCESSED }
              className={ itemIsRunning || fileStatus !== FileStatus.PROCESSED ? 'text-gray-400 cursor-not-allowed' : '' }>
              <LuShapes className='size-4 me-2' /> Add to collection
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={() => handleDeleteItem(name)}
              disabled={ itemIsRunning }
              className={ itemIsRunning ? 'text-gray-400 cursor-not-allowed' : '' }>
              <IoTrashOutline className='size-4 me-2' /> Delete
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
