import { Spinner } from "flowbite-react"

interface LoadMoreProps {

  length: number

  totalElements: number

  hasNext: boolean

  loading: boolean

  onClick?: () => void
}

export default function LoadMore({ hasNext, length, loading, totalElements, onClick }: LoadMoreProps) {

  return (
    <div className="text-sm my-4 inline-flex justify-end gap-2 w-full">

      <p className="text-gray-600">Showing { length } of { totalElements }</p>

      <button type="button" disabled={ !hasNext } title="Load more"
        onClick={e => {
          e.stopPropagation()
          if (onClick) {
            onClick()
          }
        }}
        className={`px-2 ${!hasNext ? 'text-blue-400' : 'text-blue-600 hover:text-blue-700'}`}>
        { loading
        ? <span><Spinner aria-label="Running" className="size-5 me-2" /> Loading ...</span>
        : "Load more"
        }
      </button>
    </div>
  )
}
