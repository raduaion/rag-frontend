import React, { useState, useRef, useEffect, useCallback, MouseEvent } from 'react'

interface ExpandableTextProps {

  text: string

  maxLines?: number // Optional: specify maximum lines before truncation (defaults to 2)

  className?: string // Optional: for additional styling on the text container
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLines = 2, className }) => {

  const [isExpanded, setIsExpanded] = useState(false),

  [isClamped, setIsClamped] = useState(false), // True if text is longer than maxLines and thus clamped

  textRef = useRef<HTMLDivElement>(null),

  // Callback to calculate the line height dynamically
  getLineHeight = useCallback(() => {

    if (!textRef.current) return 0
    const computedStyle = window.getComputedStyle(textRef.current)
    return parseFloat(computedStyle.lineHeight) || parseFloat(computedStyle.fontSize) * 1.2
  }, []),

  // Callback to check if the text overflows the `maxLines` limit
  checkIfTextOverflows = useCallback(() => {

    if (textRef.current) {

      // Temporarily remove any clamping styles to measure the natural (full) height
      const originalDisplay = textRef.current.style.display,
      originalWebkitLineClamp = textRef.current.style.webkitLineClamp,
      originalOverflow = textRef.current.style.overflow,
      originalHeight = textRef.current.style.height

      // Unset styles to get the true scrollHeight
      textRef.current.style.display = 'block'
      textRef.current.style.webkitLineClamp = 'unset'
      textRef.current.style.overflow = 'visible'
      textRef.current.style.height = 'auto'

      const naturalHeight = textRef.current.scrollHeight,
      calculatedMaxHeight = getLineHeight() * maxLines

      // Restore original styles
      textRef.current.style.cssText = `display: ${ originalDisplay }; webkit-line-clamp: ${
        originalWebkitLineClamp }; overflow: ${ originalOverflow }; height: ${ originalHeight };`

      // Set isClamped based on whether natural height exceeds the calculated max height for `maxLines`
      setIsClamped(naturalHeight > calculatedMaxHeight)
    }
  }, [maxLines, getLineHeight])

  useEffect(() => {

    checkIfTextOverflows()

    const handleResize = () => checkIfTextOverflows()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)

  }, [text, checkIfTextOverflows])

  const toggleExpanded = (e: MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(prev => !prev)
  },

  // Styles to apply when the text is not expanded and needs to be clamped
  clampedStyles: React.CSSProperties = !isExpanded && isClamped ? {
    display: '-webkit-box',
    WebkitLineClamp: maxLines, // Set the number of lines
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    // textOverflow: 'ellipsis' is typically implied by -webkit-line-clamp
  } : {}

  return (
    <div className={ className }>

      <div ref={ textRef } style={ clampedStyles }>
        { text }
      </div>

      { isClamped && (
        <button type='button' onClick={ toggleExpanded } title='Click to expand/shrink'
          className="text-blue-600 hover:underline cursor-pointer text-sm mt-1 focus:outline-none">
          { isExpanded ? 'Show Less' : '...Show More' }
        </button>
      )}
    </div>
  )
}

export default ExpandableText
