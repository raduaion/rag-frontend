import { convertTimestampToLocalDate, fillingZeroUtility, filterCollections } from "@/libs/helpers"
import { IndexDetails } from "@/libs/IndexDetails"
import { Alert, Popover, Spinner, ToggleSwitch } from "flowbite-react"
import moment from "moment"
import { ReactNode, useEffect, useState } from "react"
import { LuSearch } from "react-icons/lu"
import { TfiFiles } from "react-icons/tfi"
import ButtonRounded from "./fragments/ButtonRounded"
import { FaExclamationTriangle } from "react-icons/fa"
import { MdOutlineClose } from "react-icons/md"
import LoadMore from "./LoadMore"

interface CollectionPopoverProps {

  children: ReactNode

  selectedCollections: IndexDetails[]

  originalCollections: IndexDetails[]

  fetchCollections: () => void

  fetchPublicCollections: (isReload: boolean) => void

  originalPublicCollections: IndexDetails[]

  loading: boolean

  error: string | null

  saving: boolean

  closeError: () => void

  addConversationCollections: (data: IndexDetails[], callBack: () => void) => void

  conversationId: string | undefined

  hasNext: boolean

  hasNextPublic: boolean

  totalElements: number

  totalElementsPublic: number
}

export default function CollectionPopover({ children, conversationId, originalCollections, selectedCollections, 
  originalPublicCollections, fetchCollections, fetchPublicCollections, loading, saving, error, closeError, 
  addConversationCollections, hasNext, hasNextPublic, totalElements, totalElementsPublic }: CollectionPopoverProps) {

  const [collections, setCollections] = useState<IndexDetails[]>([]),

  [publicCollections, setPublicCollections] = useState<IndexDetails[]>([]),

  [searchText, setSearchText] = useState(''),

  [itemSelected, setItemSelected] = useState<string[]>([]),

  disabled = loading || saving,

  isItemSelected = (indexId: string) => itemSelected.includes(indexId),

  selectItemClicked = (checked: boolean, indexId: string) =>
    setItemSelected(prev => checked ? [...prev, indexId] : prev.filter(id => id !== indexId)),

  resetSelectedCollections = () => setItemSelected([]),

  [showPublicCollection, setShowPublicCollection] = useState<boolean>(false),

  saveClicked = () => {

    const allCollections = [...publicCollections, ...collections],
    result = []

    for (const id of itemSelected) {

      const elt = allCollections.find(item => item.id === id)
      if (elt) {
        result.push(elt)
      }
    }

    if (result.length) {
      addConversationCollections(result, resetSelectedCollections)
    }
    else {
      resetSelectedCollections()
    }
  },

  removeUsedCollections = (data: IndexDetails[]) =>
    data.filter(item => selectedCollections.findIndex(({ id }) => id === item.id) === -1)

  useEffect(() => {

    if (showPublicCollection) {
      fetchPublicCollections(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPublicCollection])

  useEffect(() => {

    const data = removeUsedCollections(originalCollections)
    setCollections(filterCollections(data, searchText))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalCollections, selectedCollections, searchText])

  useEffect(() => {

    const data = removeUsedCollections(originalPublicCollections)
    setPublicCollections(filterCollections(data, searchText))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalPublicCollections, selectedCollections, searchText])

  useEffect(() => {

    closeError()
    resetSelectedCollections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  const renderTitle = () => (
    <div className="flex items-center justify-between gap-1 flex-wrap min-h-10">

      <h4 className="text-gray-600 text-sm">Collections</h4>

      <ToggleSwitch checked={ showPublicCollection } label="Public" onChange={ setShowPublicCollection } sizing="sm" />

      { !!itemSelected.length && <>
        <button type="button" onClick={ saveClicked } disabled={ disabled }
          className="hover:bg-gray-100 p-1.5 px-2.5 rounded-3xl" title='Add selected collections to Chat'>
          <span className="text-blue-600">
            { saving
            ? <Spinner aria-label="Running" className="size-5 me-1" />
            : <span>({ fillingZeroUtility(itemSelected.length) })</span>}
            {' '} Save
          </span>
        </button>

        <ButtonRounded type="button" onClick={ resetSelectedCollections } title='Cancel selection'
          disabled={ disabled }>
          <MdOutlineClose className='size-5 text-gray-500' />
        </ButtonRounded>
      </>}
    </div>
  ),

  renderSearchZone = () => (
    <div className="flex items-center justify-between gap-1 flex-wrap pb-1">

      <label className="flex items-center relative flex-grow">

        <LuSearch className="size-4 absolute text-gray-500" />

        <input
          value={ searchText }
          onChange={e => setSearchText(e.target.value)}
          placeholder="Search.."
          className="text-gray-700 p-1 ps-6 text-sm focus:outline-none border-b border-transparent focus:border-gray-200 bg-white flex-grow"
          autoFocus
        />
      </label>

      { loading && <Spinner aria-label="Running" className="size-5" /> }
    </div>
  ),

  renderError = () => !!error && <Alert color="failure" icon={() => <FaExclamationTriangle className="size-6" /> }
    onDismiss={ closeError } className="mb-3">&nbsp; { error }
  </Alert>,

  renderSelectedCollections = () => !!selectedCollections.length && (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 my-2 sm:my-3">

    { selectedCollections.map(({ name, createdAt }, index) => (
      <span key={ index }
        className=" bg-gray-100 border rounded-3xl pl-3 pr-1 py-1 hover:bg-gray-50 inline-flex justify-between items-center"
        title={ name + ' - ' + convertTimestampToLocalDate(parseInt(createdAt, 10), true) }>
        <span className="truncate w-full text-sm text-gray-600">{ name }</span>
      </span>
    ))}
    </div>
  ),

  renderNoCollections = (length: number) => !loading && !length && (
    <p className="text-gray-500 text-sm text-center my-5">
      No collections found!
    </p>
  ),

  renderCollections = (colls: IndexDetails[]) => !!colls.length && (
    <ul className="space-y-1.5">

      { colls.map(({ id, name, files: collFiles, createdAt }) => {

        const isSelected = isItemSelected(id)

        return <li key={ id } onClick={() => selectItemClicked(!isSelected, id)}
          className={`p-2 sm:p-3 border rounded-lg ${ isSelected ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-100 '}`}>

          <span className="text-teal-800 text-sm">{ name }</span>

          <div className="flex justify-between flex-wrap">

            <p className="text-gray-600 text-xs inline-flex items-center gap-1">
              <TfiFiles />
              { fillingZeroUtility(Object.keys(collFiles).length) } files
            </p>
    
            <span className="text-gray-500 text-xs" title={ convertTimestampToLocalDate(parseInt(createdAt, 10), true) }>
              { moment(parseInt(createdAt, 10) * 1000).fromNow() }
            </span>
          </div>
        </li>})
      }
    </ul>
  ),

  currentCollections = showPublicCollection ? publicCollections : collections,

  currentHasNext = showPublicCollection ? hasNextPublic : hasNext,

  currentTotalElements = showPublicCollection ? totalElementsPublic : totalElements,

  renderContent = () => (
    <div className="w-[95dvw] min-[400px]:w-[380px] p-2 sm:p-3">

      { renderTitle() }

      { renderError() }

      { renderSearchZone() }

      { renderSelectedCollections() }

      <div className="min-h-[30vh] max-h-[50vh] overflow-auto custom-div-scrollbar">

        { renderNoCollections(currentCollections.length) }

        { renderCollections(currentCollections) }

        <LoadMore
          hasNext={ currentHasNext }
          length={ (showPublicCollection ? originalPublicCollections : originalCollections).length }
          loading={ loading }
          totalElements={ currentTotalElements }
          onClick={() => showPublicCollection ? fetchPublicCollections(false) : fetchCollections()}
        />
      </div>
    </div>
  )

  return (
    <Popover trigger="click"
      content={ renderContent() }
      placement="top">
      { children }
    </Popover>
  )
}
