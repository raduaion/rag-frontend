import { useState, useEffect } from 'react'

/**
 * Custom hook to debounce a value.
 * 
 * @param {string} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {string} The debounced value.
 */
function useDebounce(value: string, delay: number): string {

  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function: If value changes before the delay, clear the previous timer
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Only re-run if value or delay changes

  return debouncedValue
}

export default useDebounce
