
export type NumberComparatorType = 'NONE' | 'LT' | 'LTE' | 'EQ' | 'GT' | 'GTE' | 'DIFF'

interface NumberComparatorDropdownProps {
  value: string
  onClick: (val: NumberComparatorType) => void
  disabled?: boolean
}

export default function NumberComparatorDropdown({ value, onClick, disabled }: NumberComparatorDropdownProps) {

  return (
    <select className="bg-white border border-gray-200 font-normal rounded-lg focus:ring-blue-100 focus:border-blue-200"
      value={ value }
      onChange={e => onClick(e.target.value as NumberComparatorType)}
      disabled={ disabled }
      >
      <option value="NONE"></option>
      <option value="EQ">=</option>
      <option value="GT">&gt;</option>
      <option value="GTE">&gt;=</option>
      <option value="LT">&lt;</option>
      <option value="LTE">&lt;=</option>
      <option value="DIFF">!=</option>
    </select>
  )
}