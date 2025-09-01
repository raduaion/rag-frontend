
import React from 'react'

interface HoverRevealDivProps {
  mainContent: React.ReactNode
  actionElement: React.ReactNode
  className?: string
}

const HoverRevealDiv: React.FC<HoverRevealDivProps> = ({ mainContent, actionElement, className }) => {
  return (
    <div
      className={`relative flex items-center justify-between group transition-all duration-200 ease-in-out
      ${ className || '' }`}>

      <div className="flex-grow mr-4"> {/* Add some right margin to separate content from action */}
        { mainContent }
      </div>

      {/* The action element that appears on hover */}
      <div
        className={`
          absolute right-2 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100
          pointer-events-none group-hover:pointer-events-auto`
        }>
        { actionElement }
      </div>
    </div>
  )
}

export default HoverRevealDiv
