import Conversation from "@/libs/Conversation"
import { formatChatMessage } from "@/libs/helpers"
import { Spinner } from "flowbite-react"
import moment from "moment"
import DropdownChatMenu from "./DropdownChatMenu"
import Message2 from "@/components/fragments/icons/Message2"

interface ConversationItemProps {

  active?: boolean

  conversation?: Conversation

  onSelect: () => void

  runningId: string | null

  deleteConversation: (convId: string) => void

  clearConversationHistory: (convId: string) => void
  
  updateConversationData: (conv: Conversation) => void
}

const ConversationItem = ({ active, conversation, onSelect, runningId, deleteConversation,
  clearConversationHistory, updateConversationData}: ConversationItemProps) => {

  if (!conversation) return null

  const _class = active ? 'bg-gray-200' : 'bg-white',

  { id: convId, title = '', updatedAt } = conversation,

  fromNowDate = updatedAt ? moment(updatedAt * 1000).fromNow() : '',

  aDate = updatedAt ? moment(updatedAt * 1000).format('lll') : ''

  return (
    <div className={ 'py-1 px-2 border border-gray-200 md:border-none hover:bg-gray-200 rounded-md cursor-pointer ' + _class }
      onClick={ onSelect } title={ title }>

      <div className="flex items-center mb-1">

        <Message2 className="size-6 text-gray-400" />

        <span className="text-sm font-medium text-gray-700 ms-2 truncate w-full"
          dangerouslySetInnerHTML={{ __html: formatChatMessage(title) }} />

        { runningId === convId 
        ? <span className="p-1">
            <Spinner aria-label="Running" className="size-5"/>
          </span>
        : <DropdownChatMenu
            conversationId={ convId }
            deleteConversation={ deleteConversation }
            isMain={ false }
            clearConversationHistory={ clearConversationHistory }
            currentTitle={ title }
            updateConversationData={ updateConversationData }
          />
        }
      </div>

      <p className="text-xs text-right text-gray-400 dark:text-gray-300" title={ aDate }>
        { fromNowDate }
      </p>
    </div>
  )
}

export default ConversationItem
