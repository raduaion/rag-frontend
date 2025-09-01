import { FileDetails } from "./FileDetails"
import PagedResult from "./PagedResult"

/**
 * DTO CollectionPagedResult
 */
export default interface CollectionPagedResult<T> extends PagedResult<T> {

  files: FileDetails[]
}
