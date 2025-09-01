import { FileStatus } from "./FileStatus"

/**
 * FileDetails interface
 */
export interface FileDetails {

  name: string

  originalName: string

  dateUploaded: string

  sizeReadable: string

  sizeInBytes: number

  checksum: string

  metadata: null | Record<string, string>
}
