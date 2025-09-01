/**
 * IndexDetails interface
 */
export interface IndexDetails {

  id: string

  name: string

  files: Record<string, string>

  createdAt: string

  updatedAt?: string

  shared?: boolean
}
