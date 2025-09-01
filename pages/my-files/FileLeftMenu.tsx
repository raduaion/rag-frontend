import DateFilter, { DateFilterType } from "@/components/fragments/DateFilter"
import { FileStatusFilters, FileStatusType } from "./MyFilesRom"
import { NumberComparatorType } from "@/components/NumberComparatorDropdown"
import { Button, Dropdown } from "flowbite-react"
import { FiMoreHorizontal } from "react-icons/fi"
import { AiOutlineQuestionCircle } from "react-icons/ai"
import { LuRefreshCw } from "react-icons/lu"
import DropdownItemStatus from "./DropdownItemStatus"
import moment from "moment"
import { ACCEPTED_FILES, DATE_FORMAT_STR } from "@/libs/helpers"
import { RefObject } from "react"
import { AiOutlineCloudUpload } from "react-icons/ai"
import { FaAngleDown } from "react-icons/fa6"

interface FileLeftMenuProps {

  running: boolean

  dateFilter: DateFilterType

  statusFilter: FileStatusType

  refresh: () => void

  statusFilterChanged: (v: FileStatusType) => void

  resetFilterClicked: () => void

  dateComparatorFilterChanged: (cmp: NumberComparatorType) => void

  dateFilterChanged: (date: string) => void

  fileInputRef:  RefObject<HTMLInputElement | null>

  uploading: boolean

  handleUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileLeftMenu({ running, dateFilter, statusFilter, refresh, statusFilterChanged,
  resetFilterClicked, dateComparatorFilterChanged, dateFilterChanged, fileInputRef, uploading, handleUpload
}: FileLeftMenuProps) {

  return <>
    <h2 className="text-lg font-bold flex items-center justify-between">

      <span>My Files</span>

      <div onClick={e => e.stopPropagation()}>
        <Dropdown label=""
          renderTrigger={() =>
          <span className="rounded-full block hover:bg-gray-200 p-2 cursor-pointer">
            <FiMoreHorizontal className="size-5" />
          </span>}>

          <Dropdown.Item disabled={ running }>
            <AiOutlineQuestionCircle className='size-5 me-2' /> { "What's it?" }
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item onClick={ refresh } disabled={ running }>
            <LuRefreshCw className='size-4 me-2' /> Refresh
          </Dropdown.Item>
        </Dropdown>
      </div>
    </h2>

    <hr/>

    <div className='inline-flex items-center w-full'>

      <label
        htmlFor="file-upload"
        className={`w-full text-center font-medium rounded-lg text-sm px-2 sm:px-5 py-3 bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 ${
          uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' }`}>
        { uploading ? 'Uploading...' : <p className="flex items-center justify-center gap-2">
          <AiOutlineCloudUpload className="size-5" /> Add Files</p> }
      </label>

      <input
        ref={ fileInputRef }
        id="file-upload"
        type="file"
        accept={ ACCEPTED_FILES.join(', ') }
        multiple
        onChange={ handleUpload }
        className="hidden"
        disabled={ uploading }
      />
    </div>

    <div>
      <label className='block'>Status</label>
      <Dropdown renderTrigger={() => (
        <span className="px-3 py-2.5 w-full border rounded-lg inline-flex items-center cursor-pointer hover:bg-gray-50 hover:text-teal-700">
          <span className="flex-1 text-center text-sm">{ statusFilter }</span>
          <FaAngleDown className="text-gray-500" />
        </span>)
      }>
        { FileStatusFilters.map((item, index) => 
          <DropdownItemStatus key={ index } status={ item } onClick={() => statusFilterChanged(item)} disabled={ running } />
        )}
      </Dropdown>
    </div>

    <label className='block'>Created at
      <DateFilter
        compValue={ dateFilter.comparator }
        compOnChange={ dateComparatorFilterChanged }
        inputValue={ dateFilter.value }
        inputOnchange={ dateFilterChanged }
        max={ moment().format(DATE_FORMAT_STR) }
        disabled={ running }
        className='mt-1 w-full overflow-auto'
      />
    </label>

    <Button color='gray' onClick={ resetFilterClicked } className='w-full' disabled={ running }>
      <span className='text-xs uppercase'>Reset Filters</span>
    </Button>
  </>
}
