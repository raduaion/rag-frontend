import Conversation from "./Conversation"
import { IndexDetails } from "./IndexDetails"
import { TAP_SCREEN } from "./TabScreen"

export default interface ConversationMenuProps {

  conversations: Conversation[],

  activeId ?: string,

  setConversationId: (conversationId: string) => void

  newConversation: () => void

  tabClicked: (tab: TAP_SCREEN) => void

  selectedCollections: IndexDetails[]

  runningLoad: boolean

  runningId: string | null

  deleteConversation: (convId: string) => void

  removeSelectedCollection: (id: string) => void

  clearConversationHistory: (convId: string) => void

  updateConversationData: (conv: Conversation) => void

  loadConversations: () => void

  doRemoveAllConversationCollections: () => void
}
