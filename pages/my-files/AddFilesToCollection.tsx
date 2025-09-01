import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import ApiRequest from "@/libs/ApiRequest"
import { FileDetails } from "@/libs/FileDetails"
import { convertTimestampToLocalDate, fillingZeroUtility, getFileStatus } from "@/libs/helpers"
import { IndexDetails } from "@/libs/IndexDetails"
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { FaCircleExclamation, FaTriangleExclamation } from "react-icons/fa6"
import { LuShapes } from "react-icons/lu"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { TfiFiles } from "react-icons/tfi"
import { FileStatus } from "@/libs/FileStatus"
import { CiSquarePlus } from "react-icons/ci"
import ButtonRounded from "@/components/fragments/ButtonRounded"
import { GoArrowLeft, GoArrowRight } from "react-icons/go"
import { LuSearch } from "react-icons/lu"
import { IoReloadSharp } from "react-icons/io5"
import moment from "moment"
import { AppDispatch } from "@/redux/store"
import CollectionPagedResult from "@/libs/CollectionPagedResult"
import LoadMore from "@/components/LoadMore"

interface AddFilesToCollectionProps {

  open: boolean

  close: () => void

  files: FileDetails[]

  dispatch: AppDispatch
}

const SIZE_NAV = 10

export default function AddFilesToCollection({ open, close, files, dispatch }: AddFilesToCollectionProps) {

  const validFiles = files.filter(({ metadata }) => getFileStatus(metadata) === FileStatus.PROCESSED),

  [collections, setCollections] = useState<IndexDetails[]>([]),

  [originalCollections, setOriginalCollections] = useState<IndexDetails[]>([]),

  [indexName, setIndexName] = useState<string>(''),

  [searchText, setSearchText] = useState<string>(''),

  [loading, setLoading] = useState(false),

  [running, setRunning] = useState(false),

  [creating, setCreating] = useState(false),

  [error, setError] = useState<string | null>(null),

  [page, setPage] = useState(0),

  [hasNext, setHasNext] = useState(false),

  [totalElements, setTotalElements] = useState(0),

  [chosenCollection, setChosenCollection] = useState<string | null>(null),

  [showFiles, setShowFiles] = useState(false),

  [shouldCreate, setShouldCreate] = useState(false),

  filterCollections = (originals: IndexDetails[], searchStr: string) => {

    const result = originals.filter(({ name }) => {

      const searchT = searchStr.trim().toLowerCase()
      let searchTextOk = true
      if (searchT) {
        searchTextOk = name.toLowerCase().includes(searchT)
      }
      return searchTextOk
    })

    setCollections(result)
  },

  fetchCollections = async (isReload: boolean) => {

    setLoading(true)
    setError(null)

    try {

      const result: CollectionPagedResult<IndexDetails> = await ApiRequest.filterIndexes(
        dispatch, 
        isReload ? 0 : page,
        SIZE_NAV,
        false
      )

      setOriginalCollections(isReload ? result.content : [...originalCollections, ...result.content])
      setPage(result.currentPage + 1)
      setHasNext(result.hasNext)
      setTotalElements(result.totalElements)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoading(false)
    }
  },

  doAddCollectionFiles = async () => {

    if (!validFiles.length) {
      setError('Please select at least one file.')
      return
    }
    else if (!chosenCollection) {
      setError('Please select a collection')
      return
    }

    // Check for duplicate values
    const itemIndex = originalCollections.findIndex(({ id }) => id === chosenCollection)
    if (itemIndex > -1) {

      const filesInCollection = Object.keys(originalCollections[itemIndex].files)
      for (const file of validFiles) {

        if (filesInCollection.includes(file.name)) {
          setError('Duplicate file: ' + file.originalName)
          return
        }
      }
    }

    setRunning(true)
    setError(null)

    try {
      const resp: IndexDetails = await ApiRequest.addCollectionFiles(dispatch, chosenCollection, validFiles.map(({ name }) => name))

      // addOrUpdateOriginalCollections(resp)

      if (itemIndex > -1) {
        const tmp = [...originalCollections]
        tmp[itemIndex] = resp
        setOriginalCollections(tmp)
      }

      setTimeout(closeCard, 400)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  doCreateCollection = async () => {

    const nameTrimed = indexName.trim()
    if (!nameTrimed) {
      setError('Please provide a collection name.')
      return
    }
    else if (!validFiles.length) {
      setError('Please select at least one file.')
      return
    }

    setCreating(true)
    setError(null)

    try {
      await ApiRequest.createIndex(dispatch, nameTrimed, validFiles.map(({ name }) => name))
      fetchCollections(true)
      setTimeout(closeCard, 400)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setCreating(false)
    }
  },

  createNewCollectionClicked = () => {
    setShouldCreate(true)
    setChosenCollection(null)
  },

  closeCard = () => {
    setShouldCreate(false)
    setChosenCollection(null)
    setSearchText('')
    setShowFiles(false)
    setIndexName('')
    setError(null)
    close()
  }

  useEffect(() => {
    fetchCollections(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    filterCollections(originalCollections, searchText)
  }, [originalCollections, searchText])

  const renderHeader = () => (
    <div className="flex gap-2 text-gray-700">

      <LuShapes className="size-10 text-orange-400" />

      <div>
        <h2 className="text-lg sm:text-xl font-bold">
          Add files to collection
        </h2>

        <div className="inline-flex items-center flex-wrap gap-2">

          <button className="text-gray-400 text-sm flex items-center gap-1"
            onClick={() => setShowFiles(!showFiles)}>
            { fillingZeroUtility(files.length) } file{ files.length > 1 ? 's' : '' } selected
            { showFiles ? <IoIosArrowUp /> : <IoIosArrowDown /> }
          </button>

          <VerticalSeparator />

          <ButtonRounded onClick={() => fetchCollections(true)} disabled={ loading }
            title="Reload list">
            <IoReloadSharp className="text-gray-500" />
          </ButtonRounded>

          { loading && <Spinner aria-label="Running" className="size-5 ms-3" /> }

        </div>
      </div>
    </div>
  ),

  renderFiles = () => (<>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 my-2 sm:my-4">

    { files.map(({ originalName, dateUploaded, metadata }, index) => (
      <span key={ index }
        className=" bg-gray-100 border rounded-3xl pl-3 pr-1 py-1 hover:bg-gray-50 inline-flex justify-between items-center"

        title={`${ getFileStatus(metadata) !== FileStatus.PROCESSED ? 'Invalid file' 
        : originalName + ' - ' + convertTimestampToLocalDate(parseInt(dateUploaded, 10), true) }`}>

        <span className="truncate w-full text-sm text-gray-600">{ originalName }</span>
        { getFileStatus(metadata) !== FileStatus.PROCESSED
        && <FaCircleExclamation className="text-orange-400" />}
      </span>
    ))}
    </div>

    { validFiles.length !== files.length &&
    <p className="text-xs text-gray-500 inline-flex items-center ps-2">
      <FaCircleExclamation className="size-3.5 me-1" />
      { "Some files are invalid and won't be included in the collection!" }  
    </p>}
  </>),

  showCollections = () => !!collections.length &&

  <ul className="space-y-2">

    { collections.map(({ id, name, createdAt, files: collFiles }) =>

    <li key={ id } onClick={() => setChosenCollection(chosenCollection === id ? null : id)}
      className={`p-2 sm:p-3  border rounded-lg ${
      chosenCollection === id ? 'bg-blue-100 border-blue-200' : 'hover:bg-gray-100 '}`}>

      <div className="flex justify-between flex-wrap">
        <h3 className="text-teal-800">{ name }</h3>
        <span className="text-gray-500 text-xs" title={ convertTimestampToLocalDate(parseInt(createdAt, 10), true) }>
          { moment(parseInt(createdAt, 10) * 1000).fromNow() }
        </span>
      </div>

      <p className="text-gray-600 text-xs inline-flex items-center gap-1">
        <TfiFiles />
        { fillingZeroUtility(Object.keys(collFiles).length) } files
      </p>
    </li>)}
  </ul>,

  renderSearchZone = () => (
    <label className="inline-flex items-center relative">

      <LuSearch className="size-5 absolute text-gray-500" />

      <input
        value={ searchText }
        onChange={e => setSearchText(e.target.value)}
        placeholder="Search.."
        className="text-gray-700 p-1 ps-6 text-sm focus:outline-none focus:border-b bg-white"
        autoFocus
      />
    </label>
  ),

  renderTopMenu = () => <>

    { renderSearchZone() }

    <Button color="gray" className="inline-flex items-center text-teal-800"
      onClick={ createNewCollectionClicked }>
      <CiSquarePlus className="size-5 me-1" />
      New collection
    </Button>
  </>,

  renderCreateCollection = () => <>

    <ButtonRounded onClick={() => setShouldCreate(false)}>
      <GoArrowLeft className="size-6" />
    </ButtonRounded>

    <form className="flex items-center gap-1" onSubmit={e => {
        e.preventDefault()
        if (!creating && indexName.trim()) {
          doCreateCollection()
        }
      }}>

      <TextInput
        value={ indexName }
        onChange={e => setIndexName(e.target.value)}
        placeholder="Enter collection name"
        autoFocus
        disabled={ creating }
      />

      <Button isProcessing={ creating } disabled={ creating || !indexName.trim() }
        onClick={ doCreateCollection }>
        Save
      </Button>
    </form>
  </>,

  renderButtonBottom = () => (
    <div className="flex justify-end mt-4">
      <Button disabled={ running || !chosenCollection } isProcessing={ running } title="Save"
        onClick={ doAddCollectionFiles }>
        Confirm <GoArrowRight className="size-5 ms-1" />
      </Button>
    </div>
  )

  return (
    <Modal show={ open } size="3xl" onClose={ closeCard } popup dismissible>

      <Modal.Header />

      <Modal.Body>

        { renderHeader() }

        { showFiles && renderFiles() }

        { error && <Alert color="failure" icon={() => <FaTriangleExclamation className="size-4 me-1" /> }
          onDismiss={() => setError(null)} className="my-2"> { error }
        </Alert>}

        <div className="flex items-center justify-between flex-wrap gap-1 mt-2 mb-2">
          { !shouldCreate 
          ? renderTopMenu()
          : renderCreateCollection()
          }
        </div>

        <div className="min-h-[50vh] max-h-[50vh] overflow-auto custom-div-scrollbar">

          { showCollections() }
          
          <LoadMore
            hasNext={ hasNext }
            length={ originalCollections.length }
            loading={ loading }
            totalElements={ totalElements }
            onClick={() => fetchCollections(false)}
          />
        </div>

        { renderButtonBottom() }

      </Modal.Body>
    </Modal>
  )
}
