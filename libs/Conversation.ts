import { IndexDetails } from "./IndexDetails"
import Message from "./Message"

export default interface Conversation {

  id: string

  title?: string

  userId: string

  history: Message[]

  updatedAt?: number

  collections?: string[]

  collectionData?: IndexDetails[]
}
