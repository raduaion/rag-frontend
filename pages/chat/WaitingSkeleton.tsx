
export default function WaitingSkeleton({}) {

  return (
    <div className="max-w-5xl mx-auto mt-5 sm:mt-10 mb-5 sm:mb-10 relative">
      <div role="status" className="animate-pulse">

        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[250px] sm:max-w-[640px] mb-2.5 mx-auto"></div>

        <div className="flex items-center justify-center mt-2 sm:mt-3">
          <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
          <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}