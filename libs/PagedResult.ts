
/**
 * DTO PagedResult
 */
export default interface PagedResult<T> {

  content: T[]

  totalElements: number

  pageSize: number

  currentPage: number

  hasNext: boolean
}
