import ButtonRounded from "@/components/fragments/ButtonRounded"
import ShareAllIcon from "@/components/fragments/icons/ShareAllIcon"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import { fillingZeroUtility } from "@/libs/helpers"
import { Dropdown } from "flowbite-react"
import { LuRefreshCw } from "react-icons/lu"
import { SlLock } from "react-icons/sl"
import { IoTrashOutline, IoCloseOutline } from "react-icons/io5"
import SpinnerIcon from "@/components/fragments/icons/SpinnerIcon"

interface SelectionOptionProps {

  isPublicPath: boolean

  running: boolean

  loadingIndexes: boolean

  selectedIndexes: string[]

  runningItem: string | null

  canCheckAll: () => boolean

  selectAllClicked: (v: boolean) => void

  refreshRoute: () => void
  
  setShareState: (v: boolean) => void

  setConfirmDeleteMany: (v: boolean) => void

  resetSelectedCollections: () => void
}

export default function HeaderSection({ isPublicPath, running, loadingIndexes, runningItem, selectedIndexes, canCheckAll, 
  selectAllClicked, refreshRoute, setShareState, setConfirmDeleteMany, resetSelectedCollections }: SelectionOptionProps) {

  return (
    <div className='mb-3 md:mb-4 mt-2 flex items-center flex-wrap gap-2'>

      <label className='cursor-pointer hover:bg-gray-200 px-3 py-2.5 text-sm rounded-full inline-flex items-center'
        onClick={e => e.stopPropagation()} title='Select'>
        <input
          type='checkbox'
          checked={ canCheckAll() }
          onChange={e => selectAllClicked(e.target.checked)}
          className="rounded cursor-pointer border-gray-300 hover:border-gray-600"
          disabled={ running || !!runningItem || loadingIndexes } /> &nbsp; Select all
      </label>

      <ButtonRounded onClick={ refreshRoute } title='Refresh list'
        disabled={ running || loadingIndexes }>
        <LuRefreshCw className='size-4' />
      </ButtonRounded>

      { !!selectedIndexes.length && 
      <>

        <span className='text-gray-500 me-2' title={`${ selectedIndexes.length } collections are selected`}>
          Selected: { fillingZeroUtility(selectedIndexes.length) }
        </span>

        { !isPublicPath && <>
        <VerticalSeparator />

        <Dropdown inline label={ <span className='text-gray-600'>Sharing</span> }
          disabled={ running || loadingIndexes }>
          <Dropdown.Item onClick={() => setShareState(false)}>
            <SlLock className='size-5 me-2' /> Make Private
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item onClick={() => setShareState(true)}>
            <ShareAllIcon className='size-5 me-2' /> Make Public
          </Dropdown.Item>
        </Dropdown>

        <VerticalSeparator />

        <ButtonRounded disabled={ running || loadingIndexes }
          onClick={() => setConfirmDeleteMany(true)}
          title='Delete selected'>
          <IoTrashOutline className='size-4' />
        </ButtonRounded>
        </>}

        <VerticalSeparator />

        <ButtonRounded onClick={ resetSelectedCollections } title='Cancel selection'
          disabled={ running || loadingIndexes }>
          <IoCloseOutline className='size-5' />
        </ButtonRounded>
      </>
      }

      { loadingIndexes && <p className="text-blue-600 ms-2">
        <SpinnerIcon className='inline size-4 animate-spin' /> Loading collections...</p>}

      { (running || !!runningItem) && <p className="text-blue-600">
        <SpinnerIcon className='inline size-4 animate-spin' /> Running...</p>}
    </div>
  )
}
