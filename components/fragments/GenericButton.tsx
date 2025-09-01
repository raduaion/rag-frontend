import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
}

export default function GenericButton({ onClick, children, ...rest }: Props) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        if (onClick) {
          onClick()
        }
      }}
      { ...rest }>
      { children }
    </button>
  )
}
