import { MessageStatusEnum } from "./MessageStatusEnum"
import { UserRole } from "./UserRole"

export default interface Message {

  role?: UserRole

  content?: string

  rephrased?: string

  timestamp?: number

  status?: MessageStatusEnum
}
