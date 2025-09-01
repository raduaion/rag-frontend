import { ApprovalStatus } from "./ApprovalStatus"

export default interface User {
  email?: string
  name?: string
  picture?: string
  link?: string
  status?: ApprovalStatus
}
