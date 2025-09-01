import ButtonRounded from "@/components/fragments/ButtonRounded"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import { fillingZeroUtility } from "@/libs/helpers"
import { Button } from "flowbite-react"
import { LuRefreshCw } from "react-icons/lu"
import { IoTrashOutline, IoCloseOutline } from "react-icons/io5"
import SpinnerIcon from "@/components/fragments/icons/SpinnerIcon"
import FileSortingComponent, { SortDirType } from "./FileSortingComponent"

interface SelectionOptionProps {

  running: boolean

  loading: boolean

  uploading: boolean

  selectedFiles: string[]

  runningItem: string | null

  canCheckAll: () => boolean

  selectAllClicked: (v: boolean) => void

  refreshRoute: () => void

  setShouldAddFilesToCollection: (v: boolean) => void

  setConfirmDeleteMany: (v: boolean) => void

  resetSelectedFiles: () => void,

  sortBy: string
  
  sortDir: SortDirType

  sortByChanged: (v: string) => void

  sortDirChanged: (v: SortDirType) => void
}

export default function FileHeaderSection({ running, loading, runningItem, selectedFiles, uploading, canCheckAll,
  selectAllClicked, refreshRoute, setConfirmDeleteMany, setShouldAddFilesToCollection, resetSelectedFiles,
  sortBy, sortDir, sortByChanged, sortDirChanged }: SelectionOptionProps) {

  const renderSelectedMenu = () => (
    <>
      <span className='text-gray-500 me-2' title={`${ selectedFiles.length } collections are selected`}>
        Selected: { fillingZeroUtility(selectedFiles.length) }
      </span>

      <VerticalSeparator />

      <ButtonRounded disabled={ running || loading }
        onClick={() => setConfirmDeleteMany(true)}
        title='Delete selected'>
        <IoTrashOutline className='size-4' />
      </ButtonRounded>

      <VerticalSeparator />

      <Button color='gray' onClick={() => setShouldAddFilesToCollection(true)}>
        <span className='text-xs uppercase'>Add to collection</span>
      </Button>

      <VerticalSeparator />

      <ButtonRounded onClick={ resetSelectedFiles } title='Cancel selection'
        disabled={ running || loading }>
        <IoCloseOutline className='size-5' />
      </ButtonRounded>
    </>
  )

  return (
    <div className='mb-3 md:mb-4 mt-2 flex items-center justify-between flex-wrap gap-1 sm:gap-2'>
      <div className='flex items-center flex-wrap gap-1 sm:gap-2'>

        <label className='cursor-pointer hover:bg-gray-200 px-3 py-2.5 text-sm rounded-full inline-flex items-center'
          onClick={e => e.stopPropagation()} title='Select'>
          <input
            type='checkbox'
            checked={ canCheckAll() }
            onChange={e => selectAllClicked(e.target.checked)}
            className="rounded cursor-pointer border-gray-300 hover:border-gray-600"
            disabled={ running || !!runningItem || loading } /> &nbsp; Select all
        </label>

        <ButtonRounded onClick={ refreshRoute } title='Refresh list'
          disabled={ running || loading || uploading }>
          <LuRefreshCw className='size-4' />
        </ButtonRounded>

        { !!selectedFiles.length && renderSelectedMenu() }

        { loading && <p className="text-blue-600 ms-2">
          <SpinnerIcon className='inline size-4 animate-spin' /> Loading files...</p>}

        { (running || !!runningItem) && <p className="text-blue-600">
          <SpinnerIcon className='inline size-4 animate-spin' /> Running...</p>}
      </div>

      <FileSortingComponent
        sortBy={ sortBy }
        sortDir={ sortDir }
        sortByChanged={ sortByChanged }
        sortDirChanged={ sortDirChanged }
        disabled={ running || loading }
      />
    </div>
  )
}
