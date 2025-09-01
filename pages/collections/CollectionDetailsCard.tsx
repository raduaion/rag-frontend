import CustomTimelineItem from "@/components/CustomTimelineItem"
import ButtonRounded from "@/components/fragments/ButtonRounded"
import { BadgeState, CustomBadge } from "@/components/fragments/CustomBadge"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import { FileDetails } from "@/libs/FileDetails"
import {
  convertTimestampToLocalDate,
  fillingZeroUtility,
  getCollectionKeywords,
  getFileNameById,
  getFileStatus,
} from "@/libs/helpers"
import { IndexDetails } from "@/libs/IndexDetails"
import { Alert, Button, Modal, Spinner, Timeline, Tooltip } from "flowbite-react"
import { ReactNode, useEffect, useState } from "react"
import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import ApiRequest from "@/libs/ApiRequest"
import { FileStatus } from "@/libs/FileStatus"
import { AppDispatch } from "@/redux/store"
import { useAppDispatch } from "@/redux/hooks"
import { HiOutlineBan } from "react-icons/hi"
import { IoCloseOutline } from "react-icons/io5"
import { GoPlusCircle } from "react-icons/go"
import { LuShapes } from "react-icons/lu"
import { BiShareAlt } from "react-icons/bi"
import { AiOutlineExclamationCircle } from "react-icons/ai";
import ManageCollectionFiles from "./ManageCollectionFiles"
import KeywordSkeleton from "./KeywordsSkeleton"
import FileSkeleton from "./FileSkeleton"
import MenuDropdown from "@/components/MenuDropdown"
import moment from "moment"

interface CollectionDetailsProps {

  open: boolean

  close: () => void

  collection: IndexDetails

  isPublicPath: boolean

  doUpdateCollectionStore?: (data: IndexDetails) => void

  afterCollectionDeletion?: (id: string) => void

  doAddFileForCollections?: (data: FileDetails[]) => void
}

export default function CollectionDetailsCard({ open, close, isPublicPath,
  collection: { id: collectionId, name, files: collFiles, createdAt, shared, updatedAt },
  doUpdateCollectionStore, afterCollectionDeletion, doAddFileForCollections }: CollectionDetailsProps) {

  const dispatch: AppDispatch = useAppDispatch(),

  collectionFileKeys = Object.keys(collFiles),

  [originalFiles, setOriginalFiles] = useState<FileDetails[]>([]),

  [shouldAddFile, setShouldAddFiles] = useState(false),

  [shouldShare, setShouldShare] = useState(false),

  [shouldDelete, setShouldDelete] = useState(false),

  [files, setFiles] = useState<FileDetails[]>([]),

  [selectedFiles, setSelectedFiles] = useState<string[]>([]),

  [removeItem, setRemoveItem] = useState<string | null>(null),

  [running, setRunning] = useState<boolean>(false),

  [loadingFiles, setLoadingFiles] = useState<boolean>(false),

  [loadingCollFiles, setLoadingCollFiles] = useState<boolean>(false),

  [error, setError] = useState<string | null>(null),

  createdAtNb = parseInt(createdAt, 10),

  updatedAtNb = updatedAt ? parseInt(updatedAt, 10) : null,

  createdAtStr = convertTimestampToLocalDate(createdAtNb, true),

  updatedAtStr = updatedAtNb ? convertTimestampToLocalDate(updatedAtNb, true) : null,

  itemSelected = (checked: boolean, fileId: string) =>
    setSelectedFiles(prev => checked ? [...prev, fileId] : prev.filter(id => id !== fileId)),

  filteredFiles = !originalFiles ? [] : originalFiles.filter(({ name, metadata }) =>
    getFileStatus(metadata) === FileStatus.PROCESSED && !collectionFileKeys.includes(name)),

  selectAllClicked = (checked: boolean) => setSelectedFiles(checked ? filteredFiles.map(file => file.name) : []),

  canCheckAll = (): boolean => !!filteredFiles.length && selectedFiles.length === filteredFiles.length,

  cancelAddFiles = () => {
    setSelectedFiles([])
    setShouldAddFiles(false)
  },

  fetchFiles = async () => {

    setLoadingFiles(true)
    setError(null)

    try {
      const data = await ApiRequest.listFiles(dispatch)
      setOriginalFiles(data)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoadingFiles(false)
    }
  },

  doUpdateCollectionState = async (shared: boolean) => {

    setRunning(true)
    setError(null)

    try {
      const resp = await ApiRequest.updateCollectionState(dispatch, collectionId, shared)
      if (doUpdateCollectionStore) {
        doUpdateCollectionStore(resp)
      }
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  doDeleteCollection = async () => {

    setRunning(true)
    setError(null)

    try {
      await ApiRequest.deleteIndex(dispatch, collectionId)
      if (afterCollectionDeletion) {
        afterCollectionDeletion(collectionId)
      }
      close()
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  doRemoveCollectionFile = async (fileId: string) => {

    setRunning(true)
    setError(null)

    try {
      const resp = await ApiRequest.deleteCollectionFile(dispatch, collectionId, fileId)
      if (doUpdateCollectionStore) {
        doUpdateCollectionStore(resp)
      }
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  doAddCollectionFiles = async () => {

    if (!selectedFiles.length) {
      setError('Please select at least one file.')
      return
    }

    setRunning(true)
    setError(null)

    try {

      const resp = await ApiRequest.addCollectionFiles(dispatch, collectionId, selectedFiles)
      if (doUpdateCollectionStore) {
        doUpdateCollectionStore(resp)
      }

      const addedFiles = originalFiles.filter(({ name }) => selectedFiles.includes(name))
      setFiles([ ...files, ...addedFiles ])
      if (doAddFileForCollections) {
        doAddFileForCollections(addedFiles) // Add files to store
      }
      cancelAddFiles()
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  fetchCollectionFiles = async () => {

    setLoadingCollFiles(true)
    setError(null)

    try {
      const data = await ApiRequest.getIndexFiles(dispatch, collectionId)
      setFiles(data)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoadingCollFiles(false)
    }
  }

  useEffect(() => {
    fetchCollectionFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])

  const renderPrivateMenu = () => (
    <Tooltip content={shared ? 'Stop sharing this collection' : 'Make this collection public'}>
      <button className={`text-xs ${ shared ? 'text-amber-600' : 'text-green-600' } inline-flex gap-1 hover:bg-gray-200 py-1 px-2 rounded-full`}
        onClick={() => setShouldShare(true)} disabled={ running }>
        { shared
          ? <>Stop sharing <HiOutlineBan className="size-4" /></>
          : <>Share <BiShareAlt className="size-4" /></>
        }
      </button>
    </Tooltip>
  ),

  renderHeader = () => (
    <div className="sm:flex sm:gap-2 text-gray-700">

      <LuShapes className="size-14 text-orange-400 hidden sm:block" />

      <div>
        <h2 className="text-xl sm:text-2xl font-bold">
          { name }
        </h2>

        <div className="inline-flex items-center flex-wrap gap-2">

          <span className="text-gray-400 text-sm">
            By @Anonymous
          </span>

          <VerticalSeparator />

          <span className="text-gray-500 text-sm" title={ createdAtStr }>
            { moment(createdAtNb * 1000).fromNow() }
          </span>

          <VerticalSeparator />

          <Tooltip content={`This collection is ${ shared ? 'public' : 'private' }`}>
            <CustomBadge
              statusText={ shared ? 'Public' : 'Private'}
              state={ shared ? BadgeState.COMPLETED : BadgeState.PENDING }
            />
          </Tooltip>

          <div className="inline-flex items-center gap-3 flex-wrap">
            { !isPublicPath && 
            <>
              { renderPrivateMenu() }

              { !shouldAddFile && <Button title="Add files" color="gray"
                disabled={ running } pill onClick={() => {
                  setShouldAddFiles(true)
                  fetchFiles()
                }}>
                <GoPlusCircle className='size-5 me-1' /> Add files
              </Button>}

              <MenuDropdown
                running={ running }
                noRefresh={ running || loadingCollFiles }
                doRefresh={ fetchCollectionFiles }
                doRemove={() => setShouldDelete(true)}
              />
            </>}

            { running && <Spinner aria-label="Running" className="ms-2" /> }
          </div>
        </div>
      </div>
    </div>
  ),

  renderCollectionFiles = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
    { collectionFileKeys.map((fileId, index) => (
      <span key={ index }
        className="text-gray-600 bg-gray-100 border border-gray-300 rounded-3xl pl-3 pr-1 py-1 hover:bg-gray-50 flex items-center"
        title={ getFileNameById(fileId, files) }>

        <span className="truncate w-full">
          { getFileNameById(fileId, files) }
        </span>

        { !isPublicPath && <ButtonRounded onClick={() => setRemoveItem(fileId)} title='Remove' disabled={ running }>
          <IoCloseOutline className='size-5 text-gray-400' />
        </ButtonRounded>}
      </span>
    ))}
    </div>
  ),

  renderBodyPart = (title: string, content: ReactNode) => (
    <div className="bg-gray-50 p-2 border-t text-sm text-gray-600">
      <h3 className="font-semibold mb-2">{ title }</h3>
      { content }
    </div>
  )

  return (
    <Modal show={ open } size="3xl" onClose={ close } popup dismissible>

      <Modal.Header />

      <Modal.Body>

        { renderHeader() }

        { error && (
        <Alert color="failure" icon={() => <AiOutlineExclamationCircle className="size-6" /> }
          onDismiss={() => setError(null)} className="my-2">&nbsp; { error }
        </Alert>)}

        { shouldAddFile ? 
          <ManageCollectionFiles
            loadingFiles={ loadingFiles }
            canCheckAll={ canCheckAll }
            cancelAddFiles={ cancelAddFiles }
            doAddCollectionFiles={ doAddCollectionFiles }
            filteredFiles={ filteredFiles }
            itemSelected={ itemSelected }
            running={ running }
            selectAllClicked={ selectAllClicked }
            selectedFiles={ selectedFiles }
          />
          : <>
          <div className="px-5 pt-4 pb-2 mt-5">
            <Timeline horizontal>
              <CustomTimelineItem time={ createdAtStr } body='Created' />
              <CustomTimelineItem time={ updatedAtStr ?? '' } body='Updated' />
            </Timeline>
          </div>

          <div className="space-y-4">
            { renderBodyPart(
              'Keywords', 
              loadingCollFiles ? <KeywordSkeleton /> : getCollectionKeywords(collFiles, files)
            )}
            { renderBodyPart(
              'Files (' + fillingZeroUtility(collectionFileKeys.length) + ')',
              loadingCollFiles ? <FileSkeleton /> : !!files.length && renderCollectionFiles()
            )}
          </div>
          </>
        }

        <ConfirmDialog
          open={ shouldShare }
          close={() => setShouldShare(false)}
          text={`${ shared ? 'Stop sharing' : 'Share' } this collection?`}
          proceed={() => {
            setShouldShare(false)
            doUpdateCollectionState(!shared)
          }}
          proceedText="Yes"
          cancelText="No"
          pill
        />

        <ConfirmDialog
          open={ shouldDelete }
          close={() => setShouldDelete(false)}
          text='Delete this collection?'
          proceed={() => {
            setShouldDelete(false)
            doDeleteCollection()
          }}
          proceedText="Yes"
          cancelText="No"
          pill
        />

        { !!removeItem && 
        <ConfirmDialog
          open={ !!removeItem }
          close={() => setRemoveItem(null)}
          text='Remove this file from the collection'
          proceed={() => {
            setRemoveItem(null)
            doRemoveCollectionFile(removeItem)
          }}
          proceedText="Yes"
          cancelText="No"
          pill
        />}
      </Modal.Body>
    </Modal>
  )
}
