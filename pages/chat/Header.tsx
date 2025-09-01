import ArrowLeft from "@/components/fragments/icons/ArrowLeft"
import MenuLeft from "@/components/fragments/icons/MenuLeft"
import { formatChatMessage } from "@/libs/helpers"
import DropdownChatMenu from "./DropdownChatMenu"
import Chalkboard from "@/components/fragments/icons/Chalkboard"
import Conversation from "@/libs/Conversation"

interface ChatHeaderProps {

  title: string

  conversationId: string | undefined

  deleteConversation: (convId: string) => void

  backClicked: () => void

  openConversationMenu: () => void

  clearConversationHistory: (convId: string) => void

  updateConversationData: (conv: Conversation) => void
}

export default function ChatHeader({ title, conversationId, deleteConversation, backClicked,
  openConversationMenu, clearConversationHistory, updateConversationData }: ChatHeaderProps) {

  return (
    <div className="p-2 bg-blue-600 shadow-md md:rounded-xl md:rounded-bl-none md:rounded-br-none">

      <div className="flex items-center">

        <button type="button" className="text-white p-2 block md:hidden" onClick={ backClicked } title='Back'>
          <ArrowLeft className="size-6" />
        </button>

        <button type="button" className="text-white p-2 block md:hidden" onClick={ openConversationMenu } title="Menu">
          <MenuLeft className="size-6" />
        </button>

        <div className="border rounded-full border-white p-1 hidden md:block">
          <Chalkboard className="size-6 text-white" />
        </div>

        <div className="text-md ms-2 text-gray-50 font-semibold truncate w-full"
          title={ title }
          dangerouslySetInnerHTML={{ __html: formatChatMessage(title) }} />

        { !!conversationId &&
          <DropdownChatMenu 
            conversationId={ conversationId } 
            deleteConversation={ deleteConversation } 
            isMain={ true }
            clearConversationHistory={ clearConversationHistory }
            currentTitle={ title }
            updateConversationData={ updateConversationData }
          />}
      </div>
    </div>
  )
}
