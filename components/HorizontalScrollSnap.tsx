import React, { Children, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa'
import ScrollSnapButton from "./ScrollSnapButton"

interface HorizontalScrollSnapProps {
  children: ReactNode
}

const HorizontalScrollSnap = ({ children }: HorizontalScrollSnapProps) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null),

  itemCount = Children.count(children),

  [showLeftButton, setShowLeftButton] = useState(false),

  [showRightButton, setShowRightButton] = useState(itemCount > 1),

  scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: -scrollContainerRef.current.offsetWidth / 2,
      behavior: 'smooth',
    })
  }, []),

  scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: scrollContainerRef.current.offsetWidth / 2,
      behavior: 'smooth',
    })
  }, []),

  checkButtonVisibility = useCallback(() => {
    const container = scrollContainerRef.current
    if (container) {
      setShowLeftButton(container.scrollLeft > (container.offsetWidth * 15 / 100))
      setShowRightButton(container.scrollLeft < container.scrollWidth - container.offsetWidth - 1)
    }
  }, [])

  useEffect(() => {

    const container = scrollContainerRef.current
    if (!container || itemCount === 0) return

    const handleScroll = () => {
      checkButtonVisibility()
    }

    container.addEventListener('scroll', handleScroll)

    checkButtonVisibility()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [children, itemCount, checkButtonVisibility])

  const containerStyle: React.CSSProperties = {
    scrollSnapType: 'x mandatory',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingLeft: 'calc(15% - 0.5rem)', // Adjust for the partially visible left item
    paddingRight: 'calc(15% - 0.5rem)', // Adjust for the partially visible right item
  },

  itemStyle: React.CSSProperties = {
    scrollSnapAlign: 'start',
    minWidth: '100%',
    marginRight: '1rem',
  }

  return (
    <div className="relative max-w-3xl">
      <div
        ref={ scrollContainerRef }
        className="flex"
        style={ containerStyle }
      >
        { React.Children.map(children, (child) => (
          <div style={ itemStyle }>{ child }</div>
        ))}
      </div>

      { showLeftButton &&
      <ScrollSnapButton onClick={ scrollLeft } className="left-2">
        <FaChevronCircleLeft className="size-6 text-blue-600" />
      </ScrollSnapButton>}

      { showRightButton &&
      <ScrollSnapButton onClick={ scrollRight } className="right-2">
        <FaChevronCircleRight className="size-6 text-blue-600" />
      </ScrollSnapButton>}
    </div>
  )
}

export default HorizontalScrollSnap