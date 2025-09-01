import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { FaTriangleExclamation } from "react-icons/fa6"
import ApiRequest from "@/libs/ApiRequest"
import { MdOutlineMarkChatUnread } from "react-icons/md"
import Conversation from "@/libs/Conversation"
import { AppDispatch } from "@/redux/store"
import { useAppDispatch } from "@/redux/hooks"

interface RenameChatDialogProps {

  open: boolean

  close: () => void

  conversationId: string

  currentTitle: string

  updateConversationData: (conv: Conversation) => void
}

export default function RenameChatDialog({ open, close, conversationId, currentTitle,
  updateConversationData }: RenameChatDialogProps) {

  const dispatch: AppDispatch = useAppDispatch(),

  [title, setTitle] = useState<string>(''),

  [running, setRunning] = useState(false),

  [error, setError] = useState<string | null>(null),

  doRenameChat = async () => {

    const trimedTitle = title.trim()
    if (!trimedTitle) {
      setError('Please provide a valid name.')
      return
    }

    setRunning(true)
    setError(null)

    try {
      const resp: Conversation = await ApiRequest.updateConversationTitle(dispatch, conversationId, trimedTitle)
      updateConversationData(resp)
      setTimeout(closeDialog, 400)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  closeDialog = () => {
    setRunning(false)
    close()
  }

  useEffect(() => {
    setTitle(currentTitle ?? '')
  }, [currentTitle])

  const renderHeader = () => (
    <h2 className="text-lg sm:text-xl font-medium mb-4">
      Rename this conversation
    </h2>
  ),

  renderForm = () => (
    <form className="space-y-4" onSubmit={e => {
        e.preventDefault()
        if (!running && title.trim()) {
          doRenameChat()
        }
      }}>

      <div className="flex items-center gap-2">

        <MdOutlineMarkChatUnread className="size-10 text-teal-500" />

        <TextInput
          value={ title }
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter title"
          autoFocus
          disabled={ running }
          className="flex-grow"
        />
      </div>

      <div className="flex items-center justify-end gap-2">

        <Button disabled={ running } color="gray"
          onClick={ close } pill>
          Cancel
        </Button>

        <Button isProcessing={ running } disabled={ running || !title.trim() }
          onClick={ doRenameChat } pill>
          Save
        </Button>
      </div>      
    </form>
  )

  return (
    <Modal show={ open } size="xl" onClose={ closeDialog } popup dismissible>

      <Modal.Header />

      <Modal.Body>

        { renderHeader() }

        { error && <Alert color="failure" icon={() => <FaTriangleExclamation className="size-4 me-1" /> }
          onDismiss={() => setError(null)} className="my-2"> { error }
        </Alert>}

        { renderForm() }

      </Modal.Body>
    </Modal>
  )
}