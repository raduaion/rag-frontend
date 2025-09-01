import { Button } from "flowbite-react"
import FileListCheckbox from "./FileListCheckbox"
import NoFilesAvailable from "./NoFileAvailable"
import SelectedFileInfo from "./SelectedFileInfo"
import { FileDetails } from "@/libs/FileDetails"
import LoadingSpinner from "@/components/fragments/LoadingSpinner"

interface ManageCollectionFilesProps {

  filteredFiles: FileDetails[]

  selectedFiles: string[]

  running: boolean

  loadingFiles: boolean,

  cancelAddFiles: () => void

  canCheckAll: () => boolean

  selectAllClicked: (checked: boolean) => void

  itemSelected: (checked: boolean, fileId: string) => void

  doAddCollectionFiles: () => void
}

export default function ManageCollectionFiles({ canCheckAll, cancelAddFiles, doAddCollectionFiles,
  filteredFiles, itemSelected, selectAllClicked, selectedFiles, running, loadingFiles
 }: ManageCollectionFilesProps) {

  return (
    <div className="bg-gray-50 mt-2 p-2 border-t text-sm text-gray-600">
  
      <h3 className="font-semibold mb-2 text-base">Add Files</h3>

      <>
        { loadingFiles ? <LoadingSpinner text="Loading files..." />
        : (!filteredFiles.length)
        ? <NoFilesAvailable />
        : <>
          <SelectedFileInfo
            length={ selectedFiles.length }
            disabled={ running }
            resetSelection={ cancelAddFiles }
            selectedAll={ canCheckAll() }
            selectAllClicked={ selectAllClicked }
          />
  
          <FileListCheckbox
            files={ filteredFiles }
            checked={name => selectedFiles.includes(name)}
            itemSelected={ itemSelected }
            disabled={ running }
          />
        </>}
  
        <div className="mt-4 inline-flex gap-2">
          <Button title="Cancel" color="gray" className="min-w-24"
            disabled={ running } onClick={ cancelAddFiles }>
            Cancel
          </Button>
  
          <Button title="Save"
            disabled={ running || !selectedFiles.length } onClick={ doAddCollectionFiles }
            isProcessing={ running } className="min-w-24">
            Save
          </Button>
        </div>
      </>
    </div>
  )
}
