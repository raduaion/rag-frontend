import { Button, Dropdown } from "flowbite-react"
import Link from "next/link"
import { CiSquarePlus } from "react-icons/ci"
import { FaUsers } from "react-icons/fa"
import { FiMoreHorizontal } from "react-icons/fi"
import { LuRefreshCw } from "react-icons/lu"
import { LuUser } from "react-icons/lu"
import { COLLECTION_STATE_TYPE, COLLECTION_STATES } from "./CollectionTableHead"
import moment from "moment"
import { DATE_FORMAT_STR } from "@/libs/helpers"
import DateFilter, { DateFilterType } from "@/components/fragments/DateFilter"
import { NumberComparatorType } from "@/components/NumberComparatorDropdown"
import { AiOutlineQuestionCircle } from "react-icons/ai"

interface LeftMenuProps {

  isPublicPath: boolean

  running: boolean

  dateFilter: DateFilterType

  stateFilter: COLLECTION_STATE_TYPE

  refresh: () => void

  createClicked: () => void

  stateFilterChanged: (v: COLLECTION_STATE_TYPE) => void

  resetFilterClicked: () => void

  dateComparatorFilterChanged: (cmp: NumberComparatorType) => void

  dateFilterChanged: (date: string) => void
}

export default function LeftMenu({ isPublicPath, running, dateFilter, stateFilter, dateFilterChanged, refresh,
  createClicked, stateFilterChanged, resetFilterClicked, dateComparatorFilterChanged }: LeftMenuProps) {

  const renderStateOptions = () => COLLECTION_STATES.map(({ title, value }, index) =>
    <option key={ index } value={ value }>{ title }</option>
  ),

  title = isPublicPath ? 'Public Collections' : 'My Collections'

  return <>
    <h2 className="text-lg font-bold flex items-center justify-between">

      <span>{ title }</span>

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

    <Button className="w-full bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 "
      onClick={ createClicked }>
      <CiSquarePlus className='size-5 me-1' /> Add new collection
    </Button>

    { !isPublicPath ?
    <Button className="w-full bg-gradient-to-r from-teal-200 to-lime-200 text-gray-900 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-lime-200 "
      as={ Link } href="/collections/public">
      <FaUsers className='size-5 me-2' /> Public collections
    </Button>
    :
    <Button className="w-full bg-gradient-to-r from-teal-200 to-lime-200 text-gray-900 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-lime-200 "
      as={ Link } href="/collections">
      <LuUser className='size-5 me-2' /> My collections
    </Button>}
  
    { !isPublicPath &&
    <label className='block'>Status
      <select className="bg-white border border-gray-200 font-normal rounded-lg focus:ring-blue-100 focus:border-blue-200 w-full"
        value={ stateFilter } disabled={ running }
        onChange={e => stateFilterChanged(e.target.value as COLLECTION_STATE_TYPE)}>
        { renderStateOptions() }
      </select>
    </label>}

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
