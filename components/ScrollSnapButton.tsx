import { ReactNode } from "react"

interface ScrollSnapButtonProps {

  children: ReactNode

  onClick: () => void

  className?: string
}

export default function ScrollSnapButton({ children, onClick, className }: ScrollSnapButtonProps) {

  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`hidden sm:block absolute top-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-75 rounded-full p-2
      cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-500 z-[9] ${ className ?? ''}`}
    >
      { children }
    </button>
  )
}
