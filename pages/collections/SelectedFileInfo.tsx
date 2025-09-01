import ButtonRounded from "@/components/fragments/ButtonRounded"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import { fillingZeroUtility } from "@/libs/helpers"
import { IoCloseOutline } from "react-icons/io5"

interface SelectedFileInfoProps {

  length: number

  disabled: boolean

  resetSelection: () => void

  selectAllClicked: (s: boolean) => void

  selectedAll: boolean
}

export default function SelectedFileInfo({ length, disabled, resetSelection, selectedAll, selectAllClicked  }: SelectedFileInfoProps) {
  return (
    <div className='flex items-center gap-2 flex-wrap'>

      <label className={`rounded-lg hover:bg-gray-100 p-2 flex items-center gap-1.5 text-gray-600 ${ 
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} title='Select all'>
        <input
          type='checkbox'
          onChange={e => selectAllClicked(e.target.checked)}
          checked={ selectedAll }
          className="rounded cursor-pointer"
          disabled={ disabled }
        /> Select All
      </label>

      <VerticalSeparator />

      <span className="text-orange-400 px-2 min-w-28">
        Selected: { fillingZeroUtility(length) }
      </span>

      <VerticalSeparator />

      <ButtonRounded onClick={ resetSelection } title='Cancel selection'
        disabled={ disabled }>
        <IoCloseOutline className='size-6' />
      </ButtonRounded>
    </div>
  )
}
