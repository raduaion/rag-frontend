import User from "./User"

export default interface UserAccount {

  authenticated?: boolean

  userData?: User | null

  lastConnection?: string

  apiAccessible?: boolean
}
