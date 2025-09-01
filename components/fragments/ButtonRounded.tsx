import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  pSmall?: boolean
  onClick?: () => void
}

export default function ButtonRounded({ disabled, onClick, children, title, pSmall, ...rest }: Props) {
  return (
    <button className={`${ pSmall ? 'p-1' : 'p-2'} rounded-full hover:bg-gray-200 ${ disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={e => {
        e.stopPropagation()
        if (onClick) {
          onClick()
        }
      }}
      disabled={ disabled }
      title={ title } 
      { ...rest }>
      { children }
    </button>
  )
}
