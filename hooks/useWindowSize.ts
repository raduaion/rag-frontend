import { useEffect, useState } from "react"

interface Dimensions {
  width: number
  height: number
}

/**
 * Custom hook to get window dimensions.
 * @returns {Dimensions} The window dimensions.
 */
export default function useWindowSize(): Dimensions {

  const [dimension, setDimension] = useState<Dimensions>({ width: 0, height: 0 })

  useEffect(() => {

    const onResize = () => {
      const { innerWidth: width, innerHeight: height } = window
      setDimension({ width, height })
    }

    window.addEventListener("resize", onResize)
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return dimension
}
