import { Pagination } from "flowbite-react"

interface CustomPaginationProps {

  page: number

  size: number

  totalItem: number

  onPageChange: (p: number) => void

  onSizeChange: (s: number) => void

  disabled?: boolean
}

export default function CustomPagination({ page, size, totalItem, onSizeChange, onPageChange, disabled }: CustomPaginationProps) {

  const endIndex = page * size,

  startIndex = totalItem > 0 ? endIndex - size + 1 : 0,

  totalPages = Math.ceil(totalItem / size)

  return (
    <nav className="flex flex-col items-start overflow-x-auto justify-between py-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">

      <div className="space-x-2">

        <span className="text-sm font-normal text-gray-500">
          Rows per page
        </span>

        <select value={ size }
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-20 focus:ring-blue-500 focus:border-blue-500 py-1.5 p-2.5"
          onChange={e => onSizeChange(Number(e.target.value))}
          disabled={ disabled }>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>

        <span className="text-sm font-normal text-gray-500">
          Showing {' '}
          <span className="font-semibold text-gray-900">
            { startIndex }-{ endIndex < totalItem ? endIndex : totalItem }
          </span>{' '}of{' '}
          <span className="font-semibold text-gray-900">
            { totalItem }
          </span>
        </span>
      </div>

      <Pagination
        layout="pagination"
        currentPage={ page }
        totalPages={ totalPages > 0 ? totalPages : 1 }
        onPageChange={ onPageChange }
        showIcons
      />
    </nav>
  )
}
