import { FileDetails } from "@/libs/FileDetails"
import { convertTimestampToLocalDate } from "@/libs/helpers"
import moment from "moment"

interface FileListCheckboxProps {

  files: FileDetails[] | undefined

  disabled: boolean

  checked: (name: string) => boolean

  itemSelected: (checked: boolean, fileId: string) => void
}

export default function FileListCheckbox({ files, checked, itemSelected, disabled }: FileListCheckboxProps) {

  return files && files.map(({ name, originalName, dateUploaded, sizeReadable }) => (
    <label key={ name } className={`block px-2 py-3 rounded-md hover:bg-gray-100 ${ 
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} title={ moment(parseInt(dateUploaded, 10) * 1000).fromNow() }>
      <input
        type="checkbox"
        value={ name }
        checked={ checked(name) }
        onChange={e => itemSelected(e.target.checked, e.target.value)}
        className="h-4 w-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500 mr-2"
        disabled={ disabled }
      />
      { originalName } <span className="text-sm text-gray-500">({ convertTimestampToLocalDate(parseInt(dateUploaded, 10), true) } | { sizeReadable })</span>
    </label>
  ))
}
