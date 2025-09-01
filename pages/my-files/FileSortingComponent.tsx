import { JSX } from "react"
import { Dropdown, DropdownItem } from "flowbite-react"
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"

export type SortDirType = 'ASC' | 'DESC'

const sortByNames = [
  {
    value: 'name',
    text: 'Name'
  },
  {
    value: 'size',
    text: 'Size'
  },
  {
    value: 'createTime',
    text: 'Created On'
  },
  {
    value: 'updateTime',
    text: 'Updated On'
  },
]

interface FileSortingComponentProps {

  sortBy: string

  sortDir: SortDirType

  disabled: boolean

  sortByChanged: (v: string) => void

  sortDirChanged: (v: SortDirType) => void
}

export default function FileSortingComponent({ disabled, sortBy, sortDir, sortByChanged,
  sortDirChanged }: FileSortingComponentProps) {

  const disableUp = disabled || sortDir !== 'DESC',

  disableDown = disabled || sortDir !== 'ASC',

  getText = (val: string) => sortByNames.find(item => item.value === val)?.text ?? '',

  renderDropdownItem = (index: number, text: string, onClick: () => void) => (
    <DropdownItem key={ index } onClick={ onClick } disabled={ disabled }>
      { text }
    </DropdownItem>
  ),

  renderButtonUpDown = (disabled: boolean, icon: JSX.Element, sType: SortDirType, title: string) => (
    <button onClick={() => sortDirChanged(sType)} disabled={ disabled }
      className={ `p-1 ${ disabled ? `text-gray-300` : 'text-gray-500 hover:text-gray-700' }`}
      title={ title }>
      { icon }
    </button>
  )

  return (
    <div className="inline-flex text-sm">

      <Dropdown renderTrigger={() => (
        <span className="px-3 py-2.5 text-gray-600 hover:text-gray-800 cursor-pointer">
          { getText(sortBy) }
        </span>
      )}>
        { sortByNames.map(({ value, text }, index) => renderDropdownItem(index, text, () => sortByChanged(value))) }
      </Dropdown>

      { renderButtonUpDown(disableUp, <FaLongArrowAltUp />, 'ASC', 'Up') }

      { renderButtonUpDown(disableDown, <FaLongArrowAltDown />, 'DESC', 'Down') }
    </div>
  )
}
