import { Button, Modal } from "flowbite-react"
import Exclamation from "./icons/Exclamation"

interface ConfirmDialogProps {

  open: boolean

  text: string

  close: () => void

  proceed: () => void

  proceedText?: string

  cancelText?: string

  pill?: boolean
}

export default function ConfirmDialog({ open, text, proceed, close, proceedText, cancelText, pill }: ConfirmDialogProps) {

  return (
    <Modal show={ open } size="md" onClose={ close } popup>

      <Modal.Header />

      <Modal.Body>

        <div className="text-center">

          <div className="flex justify-center mb-4">
            <Exclamation className="w-14 h-14 text-gray-400" />
          </div>

          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            { text }
          </h3>

          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={ proceed } pill={ pill }>
              { proceedText ?? "Yes, I'm sure" }
            </Button>
            <Button color="gray" onClick={ close } pill={ pill }>
              { cancelText ?? "No, cancel" }
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}