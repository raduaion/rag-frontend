import ApiRequest from "@/libs/ApiRequest"
import { FileDetails } from "@/libs/FileDetails"
import { Button, Modal } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import FileListCheckbox from "./FileListCheckbox"
import NoFilesAvailable from "./NoFileAvailable"
import SelectedFileInfo from "./SelectedFileInfo"
import { AppDispatch } from "@/redux/store"
import LoadingSpinner from "@/components/fragments/LoadingSpinner"
import { getFileStatus } from "@/libs/helpers"
import { FileStatus } from "@/libs/FileStatus"

interface CreateCollectionProps {

  collectionCreated: () => void

  open: boolean

  close: () => void

  dispatch: AppDispatch
}

export default function CreateCollection({ open, close, collectionCreated, dispatch }: CreateCollectionProps) {

  const [error, setError] = useState<string | null>(null),

  [running, setRunning] = useState<boolean>(false),

  [files, setFiles] = useState<FileDetails[]>([]),

  [selectedFiles, setSelectedFiles] = useState<string[]>([]),

  [indexName, setIndexName] = useState<string>(''),

  resetSelectedFiles = () => setSelectedFiles([]),

  bodyRef = useRef<HTMLDivElement>(null),

  nameInputRef = useRef<HTMLInputElement>(null),

  [loadingFiles, setLoadingFiles] = useState(false),

  scrollTopContent = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  },

  itemSelected = (checked: boolean, fileId: string) =>
    setSelectedFiles(prev => checked ? [...prev, fileId] : prev.filter(id => id !== fileId)),

  selectAllClicked = (checked: boolean) => setSelectedFiles(checked ? files.map(file => file.name) : []),

  canCheckAll = (): boolean => !!(files.length > 0 && selectedFiles.length === files.length),

  fetchFiles = async () => {

    setLoadingFiles(true)
    setError(null)

    try {
      const data: FileDetails[] = await ApiRequest.listFiles(dispatch)
      setFiles(data.filter(file => getFileStatus(file.metadata) === FileStatus.PROCESSED))
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoadingFiles(false)
    }
  },

  doCreateCollection = async () => {

    scrollTopContent()

    const nameTrimed = indexName.trim()
    if (!nameTrimed) {
      setError('Please provide a collection name.')
      return
    }
    else if (!selectedFiles.length) {
      setError('Please select at least one file.')
      return
    }

    setRunning(true)
    setError(null)

    try {

      await ApiRequest.createIndex(dispatch, nameTrimed, selectedFiles)
      collectionCreated()
      setSelectedFiles([])
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  cancelOperation = () => {
    close()
    setError(null)
    setSelectedFiles([])
    setIndexName('')
  }

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderError = () => error && <p className="text-red-600 mb-4">{ error }</p>,

  renderForm = () => (
    <div className='flex justify-between items-center flex-wrap gap-2'>

      <div className='flex items-center gap-2'>
        <label htmlFor="name" className="font-medium text-gray-700">Name</label>
        <input id="name"
          type="text"
          ref={ nameInputRef }
          value={ indexName }
          onChange={e => setIndexName(e.target.value)}
          className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="Enter collection name"
          disabled={ running }
        />
      </div>

      <SelectedFileInfo
        length={ selectedFiles.length }
        disabled={ running }
        resetSelection={ resetSelectedFiles }
        selectedAll={ canCheckAll() }
        selectAllClicked={ selectAllClicked }
      />
    </div>
  ),

  renderFiles = () => (
    <div className="mt-5">
      <FileListCheckbox
        files={ files }
        checked={name => selectedFiles.includes(name)}
        itemSelected={ itemSelected }
        disabled={ running }
      />
    </div>
  )

  return (
    <Modal dismissible show={ open } onClose={ close } size="4xl" initialFocus={ nameInputRef }>

      <Modal.Header>New Collection</Modal.Header>

      <Modal.Body className="min-h-52" ref={ bodyRef }>

        { renderError() }

        { loadingFiles
        ? <LoadingSpinner text="Loading files..." />
        : !files.length
          ? <NoFilesAvailable />
          : <>
            { renderForm() }
            { renderFiles() }
          </>
        }
      </Modal.Body>

      { !!files.length && <Modal.Footer>
        <Button color="gray" onClick={ cancelOperation } disabled={ running }
          className="min-w-24">
          Cancel
        </Button>
        <Button onClick={ doCreateCollection } isProcessing={ running }
          disabled={ !selectedFiles.length || running } className="min-w-24">
          { running ? 'Creating' : 'Create' }
        </Button>
      </Modal.Footer>
      }
    </Modal>
  )
}
