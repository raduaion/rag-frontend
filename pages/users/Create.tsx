import Exclamation from "@/components/fragments/icons/Exclamation"
import ApiRequest from "@/libs/ApiRequest"
import { validateEmail } from "@/libs/helpers"
import { AppDispatch } from "@/redux/store"
import { Alert, Button, Label, Modal, Select, Textarea, TextInput } from "flowbite-react"
import { useRef, useState } from "react"

interface CreateUserProps {
  userCreated: () => void
  open: boolean
  close: () => void
  dispatch: AppDispatch
}

const FilterStatus = {
  APPROVED: 'APPROVED',
  PENDING: 'PENDING',
}

export default function CreateUser({ open, close, userCreated, dispatch }: CreateUserProps) {

  const [email, setEmail] = useState<string>(""),

  [status, setStatus] = useState<string>(FilterStatus.APPROVED),

  [comment, setComment] = useState<string>(""),

  [success, setSuccess] = useState<boolean>(false),

  [error, setError] = useState<string | null>(null),

  [running, setRunning] = useState<boolean>(false),

  emailInputRef = useRef<HTMLInputElement>(null),

  emailChanged = (value: string) => {
    setEmail(value)
    setError(null)
  },

  statusChanged = (value: string) => {
    setStatus(value)
    setError(null)
  },

  commentChanged = (value: string) => {
    setComment(value)
    setError(null)
  },

  resetData = () => {
    setError(null)
    setSuccess(false)
    setEmail('')
    setComment('')
    setStatus(FilterStatus.APPROVED)
  },

  doCreateUser = async () => {

    const emailT = email.trim(),
      commentT = comment.trim()

    if (!emailT) {
      setError('Email is required!')
      return
    }

    if (!validateEmail(emailT)) {
      setError('Invalid email!')
      return
    }

    if (!status) {
      setError('Status is required!')
      return
    }

    setRunning(true)
    setSuccess(false)
    setError(null)

    const data = { email: emailT, comment: commentT ? commentT : null, status }

    try {

      await ApiRequest.createUser(dispatch, data)
      setSuccess(true)

      setTimeout(() => {
        userCreated()
        resetData()
      }, 800)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  cancelOperation = () => {
    close()
    resetData()
  },
  
  closeError = () => setError(null),

  closeSuccess = () => setSuccess(false),

  renderError = () => error && <Alert color="failure" icon={() => <Exclamation className="w-6 h-6" /> }
    onDismiss={ closeError } className="mb-4">&nbsp; { error }
  </Alert>,

  renderSuccess = () => success && <Alert color="success" icon={() => <Exclamation className="w-6 h-6" /> }
    onDismiss={ closeSuccess } className="mb-4">&nbsp; Created successfully
  </Alert>,

  renderForm = () => (
    <div className="space-y-6">

      <div className="max-w-lg">
        <div className="mb-2 block">
          <Label htmlFor="email" value="Enter email *" />
        </div>
        <TextInput id="email"
          ref={ emailInputRef }
          placeholder="name@example.com" required
          value={ email }
          onChange={e => emailChanged(e.target.value)}
          disabled={ running }
        />
      </div>

      <div className="max-w-lg">
        <div className="mb-2 block">
          <Label htmlFor="status" value="Choose status *" />
        </div>
        <Select id="status" required
          value={ status } disabled={ running }
          onChange={e => statusChanged(e.target.value)}>
          <option value={ FilterStatus.PENDING }>Pending</option>
          <option value={ FilterStatus.APPROVED }>Approved</option>
        </Select>
      </div>

      <div className="max-w-lg">
        <div className="mb-2 block">
          <Label htmlFor="comment" value="Your message" />
        </div>
        <Textarea id="comment" placeholder="Optional comment..." rows={4}
          value={ comment }
          onChange={e => commentChanged(e.target.value)}
          disabled={ running }
        />
      </div>

    </div>
  )

  return (
    <Modal dismissible show={ open } size="lg" onClose={ close } initialFocus={ emailInputRef }>

      <Modal.Header className="p-5">Add new user</Modal.Header>

      <Modal.Body>

        { renderSuccess() }
        { renderError() }
        { renderForm() }

      </Modal.Body>

      <Modal.Footer>
        <Button onClick={ doCreateUser } isProcessing={ running } disabled={ running }>
          { running ? 'Adding' : 'Add' }
        </Button>
        <Button color="gray" onClick={ cancelOperation } disabled={ running }>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
