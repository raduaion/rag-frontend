import { Button, Modal } from "flowbite-react"
import Exclamation from "./icons/Exclamation"
import Google from "./icons/Google"

interface DialogProps {
  openModal: boolean
  closeModal: () => void
  login: () => void
}

export default function UserLoggedOutDialog({ openModal, closeModal, login }: DialogProps) {

  return (
    <Modal show={ openModal } onClose={ closeModal }>
      <Modal.Body className="min-h-80 text-center">
        <div className="space-y-6 md:space-y-8">

          <div className="inline-flex justify-center items-center gap-4 text-orange-500">
            <Exclamation className="w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-2xl md:text-3xl font-semibold">Logged out!</h1>
          </div>

          <p className="text-gray-600">You were logged out. You need to log in to access this page</p>

          <div className="inline-flex justify-center">
            <Button color="blue" size="xl" className="block" onClick={ login }>
              <Google className="w-6 h-6 mr-2" />
              Login with Google
            </Button>
          </div>
        </div>
      </Modal.Body>

    </Modal>
  )
}
