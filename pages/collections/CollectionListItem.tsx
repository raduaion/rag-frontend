import {
  convertTimestampToLocalDate,
  ellipsisText,
  fillingZeroUtility,
  getCollectionKeywords,
  getFileNameById
} from "@/libs/helpers"
import { IndexDetails } from "@/libs/IndexDetails"
import { Dropdown, Spinner } from "flowbite-react"
import moment from "moment"
import { IoTrashOutline } from "react-icons/io5"
import { FaRegCalendarAlt } from "react-icons/fa"
import { SlLock, SlLockOpen } from "react-icons/sl"
import { HiEllipsisHorizontal } from "react-icons/hi2"
import { FileDetails } from "@/libs/FileDetails"
import { UpdateDetails } from "./Collections"
import { RiShareForwardFill } from "react-icons/ri"
import { PiEye } from "react-icons/pi"

interface CollectionListItemProps {

  isPublicPath: boolean

  collection: IndexDetails

  runningItem: string | null

  running: boolean

  files: FileDetails[]

  isItemSelected: (v: string) => boolean

  setshowCollectionCard: (v: string | null) => void

  selectItemClicked: (checked: boolean, indexId: string) => void

  setUpdateCollection: (v: UpdateDetails | null) => void

  handleDeleteIndex: (v: string) => void
}

export default function CollectionListItem({ isPublicPath, collection, running, runningItem, files, isItemSelected,
  setshowCollectionCard, selectItemClicked,  setUpdateCollection, handleDeleteIndex }: CollectionListItemProps) {

  const { id, name, files: collFiles, createdAt, shared } = collection,

  isItemChecked = isItemSelected(id),

  itemIsRunning = runningItem === id,

  showCard = () => setshowCollectionCard(id),

  fileNames = Object.keys(collFiles)
    .map(fileId => getFileNameById(fileId, files))
    .join(', '),

  keywords = getCollectionKeywords(collFiles, files),

  createdAtNb = parseInt(createdAt, 10),

  createdAtStr = convertTimestampToLocalDate(createdAtNb, true)

  return (
    <div key={ id } onClick={ showCard }
      className={`space-y-2 p-3 sm:p-4 my-2 shadow rounded-lg border-b cursor-pointer ${
      isItemChecked ? 'bg-orange-50' : 'odd:bg-zinc-50 even:bg-gray-50 hover:bg-gray-100' }`}>

      <div className='flex justify-between gap-1'>
        <div className='inline-flex items-center'>
          { itemIsRunning ? <Spinner aria-label="Running entry" className='m-2' />
          : <label className='cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-full'
            onClick={e => e.stopPropagation()} title='Select'>
            <input
              type='checkbox'
              checked={ isItemChecked }
              onChange={e => selectItemClicked(e.target.checked, id)}
              className="rounded-full cursor-pointer border-gray-300 hover:border-gray-600"
              disabled={ running || !!runningItem }
            />
          </label>}

          <h2 className='text-lg font-semibold ms-1' title={ name }>
            { name }
          </h2>
        </div>

        <div onClick={e => e.stopPropagation()}>
          <Dropdown label="" 
            renderTrigger={() =>
            <span className="rounded-full block p-2 cursor-pointer hover:bg-gray-200">
              <HiEllipsisHorizontal className="size-5" />
            </span>}>

            <Dropdown.Item onClick={ showCard } disabled={ itemIsRunning || running }>
              <PiEye className='size-5 me-2' /> Preview
            </Dropdown.Item>

            { !isPublicPath && <>
              { shared
              ? <Dropdown.Item onClick={() => setUpdateCollection({ id, shared: false })}
                  disabled={ itemIsRunning || running }>
                  <SlLock className='size-4 me-2' /> Stop sharing
                </Dropdown.Item>

              : <Dropdown.Item onClick={() => setUpdateCollection({ id, shared: true })}
                  disabled={ itemIsRunning || running }>
                  <RiShareForwardFill className='size-5 me-2' /> Make Public
                </Dropdown.Item>
              }

              <Dropdown.Divider />

              <Dropdown.Item onClick={() => handleDeleteIndex(id)}
                disabled={ itemIsRunning || running }>
                <IoTrashOutline className='size-4 me-2' /> Delete
              </Dropdown.Item>
            </>}
          </Dropdown>
        </div>
      </div>

      <div className='text-sm text-gray-600 space-y-2 ms-3'>
        <p><span className='font-semibold'>Files ({ fillingZeroUtility(Object.keys(collFiles).length) }):</span>
          {' '}{ ellipsisText(fileNames, 72) }
        </p>
        <p><span className='font-semibold'>Keywords:</span> { ellipsisText(keywords, 72) }</p>
      </div>

      <div className='flex items-center justify-end gap-4'>
        { shared ?
        <p className='flex items-center text-xs font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800'>
          <SlLockOpen className='me-1' /> Public
        </p>
        : <p className='flex items-center text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800'>
          <SlLock className='me-1' /> Private
        </p>}

        <div className="text-stone-500 text-xs flex items-center" title={ createdAtStr }>
          <FaRegCalendarAlt className='size-3.5 me-2' /> { moment(createdAtNb * 1000).fromNow() }
        </div>
      </div>
    </div>
  )
}