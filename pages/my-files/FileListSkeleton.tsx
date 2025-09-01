import { JSX } from "react"

const NB_ITEMS = 7

export default function FileListSkeleton() {

  const renderLine = (key: number) => (
    <div key={ key } className="pt-6">

      <div className="inline-flex items-center w-full gap-1 mb-4">
        <div className="size-3.5 bg-gray-300 rounded-full"></div>
        <div className="h-3 w-full sm:w-52 bg-gray-300 rounded "></div>
      </div>

      <div className="h-2 w-full sm:w-72 bg-gray-200 rounded-full"></div>

      <div className="flex justify-end mt-2">
        <div className="h-2 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )

  const data: JSX.Element[] = []
  for (let i = 0; i < NB_ITEMS; ++i) {
    data.push(renderLine(i))
  }

  return (
    <div role="status" className="p-6 pt-1 space-y-6 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse">
      { data }
      <span className="sr-only">Loading...</span>
    </div>
  )
}