import { MouseEvent } from "react"

interface CheckboxLabelledProps {

  checked?: boolean

  itemSelected: (checked: boolean) => void

  title?: string

  disabled?: boolean
}

export default function CheckboxLabelled({ checked, itemSelected, title, disabled }: CheckboxLabelledProps) {

  const doStopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <label className='rounded-full cursor-pointer hover:bg-gray-200 p-3'
      onClick={ doStopPropagation } title={ title }>
      <input
        type='checkbox'
        checked={ checked }
        onChange={e => itemSelected(e.target.checked)}
        className="rounded cursor-pointer"
        disabled={ disabled }
      />
    </label>
  )
}
