import NumberComparatorDropdown, { NumberComparatorType } from "@/components/NumberComparatorDropdown"

export interface DateFilterType {
  comparator: NumberComparatorType
  value: string
}

export const initDateComp: DateFilterType = { comparator: 'NONE', value: '' }

interface DateFilterProps {

  compValue: string

  compOnChange: (val: NumberComparatorType) => void

  className?: string

  inputValue?: string

  inputOnchange: (val: string) => void

  max?: string | number

  min?: string | number

  disabled?: boolean
}

export default function DateFilter({ compValue, compOnChange, inputValue, inputOnchange, className, max, min, disabled }: DateFilterProps) {
  return (
    <div className={`flex gap-1 ${ className ?? '' }`}>
      <NumberComparatorDropdown
        onClick={ compOnChange }
        value={ compValue }
        disabled={ disabled }
      />

      <input type="date" 
        className="bg-white border border-gray-200 font-normal rounded-lg focus:ring-blue-100 focus:border-blue-200 w-full"
        value={ inputValue ?? '' }
        onChange={e => inputOnchange(e.target.value)}
        max={ max }
        min={ min }
        disabled={ disabled }
      />
    </div>
  )
}
