import { ApprovalStatus } from "./ApprovalStatus"

export interface UserApproval {

  id: string

  email: string

  status: ApprovalStatus

  comment: string | null

  createdOn: number | null

  updatedOn: number | null
}
