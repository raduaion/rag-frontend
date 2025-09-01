import { HTMLInputTypeAttribute } from "react"

interface InputFilterProps {
  value?: string | number
  placeholder?: string
  onChange: (val: string) => void
  type?: HTMLInputTypeAttribute
  max?: string | number
  min?: string | number
  className?: string
}

export default function InputFilter({ value, placeholder, onChange, type = 'search', max, min, className }: InputFilterProps) {
  return (
    <input type={ type } value={ value }
      className={`bg-white border border-gray-200 text-sm font-normal rounded-lg block w-full py-2 px-2.5 min-w-16 placeholder-gray-400 placeholder:italic focus:ring-blue-100 focus:border-blue-200 ${ className ?? '' }`}
      placeholder={ placeholder }
      onChange={e => onChange(e.target.value)}
      max={ max }
      min={ min }
    />
  )
}
