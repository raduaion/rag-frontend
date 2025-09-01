import { useState, useEffect } from "react"

function useFetch<T>(url: string) {

  const [data, setData] = useState<T | null>(null),

  [loading, setLoading] = useState(true),

  [error, setError] = useState<Error | null>(null)

  useEffect(() => {

    const fetchData = async () => {

      setLoading(true)
      try {

        const response = await fetch(url),
        result = await response.json()
        setData(result)
      }
      catch (err) {
        setError(err as Error)
      }
      finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
