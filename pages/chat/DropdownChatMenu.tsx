import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import ArchiveIcon from "@/components/fragments/icons/ArchiveIcon"
import BanIcon from "@/components/fragments/icons/BanIcon"
import PenIcon from "@/components/fragments/icons/PenIcon"
import { Dropdown } from "flowbite-react"
import { useState } from "react"
import RenameChatDialog from "./RenameChatDialog"
import Conversation from "@/libs/Conversation"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { HiOutlineTrash } from "react-icons/hi2"

interface DropdownChatMenuProps {

  deleteConversation: (convId: string) => void

  clearConversationHistory: (convId: string) => void

  conversationId: string

  isMain: boolean

  currentTitle: string

  updateConversationData: (conv: Conversation) => void
}

export default function DropdownChatMenu({ deleteConversation, conversationId, isMain,
  clearConversationHistory, currentTitle, updateConversationData }: DropdownChatMenuProps) {

  const [confirmDelete, setConfirmDelete] = useState(false),

  [shouldRename, setShouldRename] = useState(false),

  [confirmClearHistory, setConfirmClearHistory] = useState(false),

  class1 = isMain
    ? "text-white hover:bg-blue-500"
    : "text-gray-400 hover:bg-gray-100",

  class2 = isMain ? "size-5" : "size-4"

  return <div onClick={e => e.stopPropagation()}>
    <Dropdown label=""
      renderTrigger={() =>
        <span className={`p-2 block cursor-pointer rounded-full ${ class1 }`}>
          <HiOutlineDotsVertical className={ class2 } />
        </span>
      }>

      <Dropdown.Item className="w-40" onClick={() => setShouldRename(true)}>
        <PenIcon className="size-4 text-gray-600 me-2" /> Rename
      </Dropdown.Item>

      <Dropdown.Item>
        <ArchiveIcon className="size-4 text-gray-600 me-2" /> Archive
      </Dropdown.Item>

      <Dropdown.Divider />

      <Dropdown.Item onClick={() => setConfirmClearHistory(true)}>
        <BanIcon className="size-4 text-gray-600 me-2" /> Clear Content
      </Dropdown.Item>

      <Dropdown.Item onClick={() => setConfirmDelete(true)}>
        <HiOutlineTrash className="size-4 text-gray-600 me-2" /> Delete Chat
      </Dropdown.Item>
    </Dropdown>

    <ConfirmDialog
      open={ confirmDelete }
      close={() => setConfirmDelete(false)}
      text={`Are you sure you want to delete this conversation?`}
      proceed={() => {
        setConfirmDelete(false)
        deleteConversation(conversationId)}
      }
    />

    <ConfirmDialog
      open={ confirmClearHistory }
      close={() => setConfirmClearHistory(false)}
      text={`This action will clear your chat history. Continue?`}
      proceed={() => {
        setConfirmClearHistory(false)
        clearConversationHistory(conversationId)}
      }
    />

    <RenameChatDialog
      open={ shouldRename }
      close={() => setShouldRename(false)}
      conversationId={ conversationId }
      currentTitle={ currentTitle }
      updateConversationData={ updateConversationData }
    />
  </div>
}
