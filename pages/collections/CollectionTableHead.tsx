import DateFilter, { DateFilterType } from "@/components/fragments/DateFilter"
import InputFilter from "@/components/fragments/InputFilter"
import { compareDateFilter, DATE_FORMAT_STR, getCollectionKeywords } from "@/libs/helpers"
import moment from "moment"
import { NumberComparatorType } from "../../components/NumberComparatorDropdown"
import { IndexDetails } from "@/libs/IndexDetails"
import { FileDetails } from "@/libs/FileDetails"
import CheckboxLabelled from "@/components/fragments/CheckboxLabelled"

export type COLLECTION_STATE_TYPE = 'ALL' | 'PUBLIC' | 'PRIVATE'

export type AUTHOR_TYPE = 'ALL'

interface CollectionStateProps {
  title: string
  value: COLLECTION_STATE_TYPE
}

export const COLLECTION_STATES: CollectionStateProps[] = [
  { title: 'All', value: 'ALL' },
  { title: 'Public', value: 'PUBLIC' },
  { title: 'Private', value: 'PRIVATE' }
]

export const doFilterCollections = (originals: IndexDetails[], files: FileDetails[], searchText: string, nameFil: string,
  filenameFil: string, keywordFil: string, dateFil: DateFilterType, stateFil: COLLECTION_STATE_TYPE, authorFil: AUTHOR_TYPE) => {

  let result: IndexDetails[] = originals

  const searchT = searchText.trim().toLowerCase(),
  nameT = nameFil.trim().toLowerCase(),
  filenameT = filenameFil.trim().toLowerCase(),
  keywordT = keywordFil.trim().toLowerCase(),
  dateT = dateFil.value.trim().toLowerCase(),
  dateComp = dateFil.comparator

  if (searchT || nameT || filenameT || keywordT || dateT || stateFil) {

    result = result.filter(({ name, files: collFiles, createdAt, shared }) => {

      const keywords: string = getCollectionKeywords(collFiles, files),

      filenames = Object.keys(collFiles).map(fileName => fileName).join(', ')

      let searchTextOk = true
      if (searchT) {
        searchTextOk = name.toLowerCase().includes(searchT)
        || filenames.toLowerCase().includes(searchT)
        || (keywords ? keywords.toLowerCase().includes(searchT) : false)
      }

      let nameOk = true
      if (nameT) {
        nameOk = name.toLowerCase().includes(nameT)
      }

      let filenameOk = true
      if (filenameT) {
        filenameOk = filenames.toLowerCase().includes(filenameT)
      }

      let keywordOk = true
      if (keywordT) {
        keywordOk = keywords ? keywords.toLowerCase().includes(keywordT) : false
      }

      let dateOk = true
      if (dateT && dateComp !== 'NONE') {
        dateOk = compareDateFilter(
          moment(parseInt(createdAt, 10) * 1000).startOf('D'),
          moment(dateT),
          dateComp
        )
      }

      let stateOk = true
      if (stateFil !== 'ALL') {
        stateOk = (stateFil === 'PRIVATE' && !shared) || (stateFil === 'PUBLIC' && !!shared)
      }

      const authorOk = true
      if (authorFil !== 'ALL') {}

      return searchTextOk && nameOk && filenameOk && keywordOk && dateOk && stateOk && authorOk
    })
  }

  return result
}

interface CollectionTableHeadProps {

  selectClicked?: (val: boolean) => void
  checked?: boolean
  disabled?: boolean
  publicCollection: boolean

  nameFilter: string
  setNameFilter: (v: string) => void

  keywordFilter: string
  setKeywordFilter: (v: string) => void

  fileNameFilter: string
  setFileNameFilter: (v: string) => void

  dateFilter: DateFilterType
  setDateComparator: (v: NumberComparatorType) => void
  setDateFilter: (v: string) => void

  stateFilter: COLLECTION_STATE_TYPE
  setStateFilter: (v: COLLECTION_STATE_TYPE) => void

  authorFilter?: AUTHOR_TYPE
  setAuthorFilter?: (v: AUTHOR_TYPE) => void
}

export default function CollectionTableHead({ checked, selectClicked, disabled, publicCollection,
  nameFilter, fileNameFilter, keywordFilter, dateFilter, stateFilter, authorFilter,
  setNameFilter, setFileNameFilter, setKeywordFilter, setDateFilter, setDateComparator, setStateFilter, setAuthorFilter
 }: CollectionTableHeadProps) {


  const renderStateOptions = () => COLLECTION_STATES.map(({ title, value }, index) =>
    <option key={ index } value={ value }>{ title }</option>
  ),

  renderShareByOptions = () => <option></option>

  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th className="p-3">

          <CheckboxLabelled
            checked={ checked }
            itemSelected={v => {
              if (selectClicked) {
                selectClicked(v)
              }
            }}
            title='Select all'
            disabled={ disabled }
          />
        </th>

        <th className="px-6 py-3 w-[20%]">

          Name

          <InputFilter
            value={ nameFilter }
            placeholder="Enter name"
            onChange={ setNameFilter }
            className='mt-1'
          />
        </th>

        <th className="px-6 py-3 w-[30%]">

          Files

          <InputFilter
            value={ fileNameFilter }
            placeholder="Enter file name"
            onChange={ setFileNameFilter }
            className='mt-1'
          />
        </th>

        <th className="px-6 py-3 w-[30%]">

          Keywords

          <InputFilter
            value={ keywordFilter }
            placeholder="Enter keyword"
            onChange={ setKeywordFilter }
            className='mt-1'
          />
        </th>

        <th className="px-6 py-3">

          Created

          <DateFilter
            compValue={ dateFilter.comparator }
            compOnChange={ setDateComparator }
            inputValue={ dateFilter.value }
            inputOnchange={ setDateFilter }
            max={ moment().format(DATE_FORMAT_STR) }
            className='mt-1'
          />
        </th>

        <th className="px-6 py-3">

          { publicCollection ? 'Shared By' : 'State' }

          <div className='font-normal mt-1 flex justify-center'>
            <select className="bg-white border border-gray-200 font-normal rounded-lg focus:ring-blue-100 focus:border-blue-200 min-w-20"
              value={ publicCollection ? authorFilter : stateFilter }
              onChange={e => publicCollection
                ? setAuthorFilter ? setAuthorFilter(e.target.value as AUTHOR_TYPE) : null
                : setStateFilter(e.target.value as COLLECTION_STATE_TYPE)}
              >
              { publicCollection ? renderShareByOptions() : renderStateOptions() }
            </select>
          </div>
        </th>

        <th></th>
      </tr>
    </thead>
  )
}