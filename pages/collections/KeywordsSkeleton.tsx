
export default function KeywordSkeleton() {

  return (
    <div role="status" className="space-y-2 animate-pulse">
      <div className="h-2.5 w-full sm:w-96 bg-gray-300 rounded-full "></div>
      <div className="h-2 w-full sm:w-80 bg-gray-200 rounded-full"></div>
      <div className="h-2 w-full sm:w-72 bg-gray-200 rounded-full"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
