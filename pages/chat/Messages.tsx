import Close from "@/components/fragments/icons/Close"
import Refresh from "@/components/fragments/icons/Refresh"
import Conversation from "@/libs/Conversation"
import { IndexDetails } from "@/libs/IndexDetails"
import Message from "@/libs/Message"
import { UserRole } from "@/libs/UserRole"
import { RefObject, useEffect, useRef, useState } from "react"
import FormChat from "./Form"
import ChatHeader from "./Header"
import MessageItemAssistant from "./MessageItemAssistant"
import MessageItemUser from "./MessageItemUser"
import WaitingSkeleton from "./WaitingSkeleton"
import MessageItemSystem from "./MessageItemSystem"
import { MessageStatusEnum } from "@/libs/MessageStatusEnum"
import ApiRequest from "@/libs/ApiRequest"
import { AppDispatch } from "@/redux/store"
import RecentQuestion from "@/libs/RecentQuestion"

interface MessageProps {

  conversation?: Conversation,

  localCollections: IndexDetails[]

  currentCollections: IndexDetails[]

  addUserQuestion: (content: string, convId: string) => void

  updateDefaultId: (oldId: string, newId: string) => void

  setLastAnswer: (convId: string, content: string, status: MessageStatusEnum) => void

  deleteConversation: (convId: string) => void

  globalError: string | null

  resetGlobalError: () => void

  openConversationMenu: () => void

  backClicked: () => void

  inputTextRef: RefObject<HTMLInputElement | null>

  clearConversationHistory: (convId: string) => void

  dispatch: AppDispatch

  setLocalCollections: (data: IndexDetails[]) => void

  updateConversationData: (data: Conversation) => void

  doDeleteRecentQuestionStore: (id: string) => void,

  doResetRecentQuestionStore: () => void

  recentQuestions: RecentQuestion[]
}

const Messages = ({ conversation, localCollections, addUserQuestion, updateDefaultId, setLastAnswer,
  deleteConversation, globalError, resetGlobalError, openConversationMenu, backClicked, inputTextRef,
  clearConversationHistory, dispatch, currentCollections, setLocalCollections,
  updateConversationData, doDeleteRecentQuestionStore,
  doResetRecentQuestionStore, recentQuestions, }: MessageProps) => {

  const conversationId: string | undefined = conversation?.id,

  history: Message[] = conversation?.history ?? [],

  title = conversation?.title ?? '',

  [text, setText] = useState<string>(''),

  [running, setRunning] = useState<boolean>(false),

  [queryRunning, setQueryRunning] = useState<boolean>(false),

  [currentStatus, setCurrentStatus] = useState<string>(""),

  [error, setError] = useState<string | null>(null),

  chatRef = useRef<HTMLDivElement>(null),

  isNewConversation = !conversationId || conversationId.startsWith('new_'),

  scrollChatToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollChatToBottom()
  }, [conversation, running])

  const onSubmitQuestion = async () => {

    const trimedText = text.trim()

    if (!trimedText || running || queryRunning) return

    const queryId = isNewConversation ? null : conversationId,

    convId = conversationId ? conversationId : 'new_' + Date.now()

    addUserQuestion(trimedText, convId)
    setText('')

    setRunning(true)
    setQueryRunning(true)
    setError(null)
    setCurrentStatus("Processing started...")

    try {
      const response = await ApiRequest.submitQuestion(
        dispatch,
        {
          conversationId: queryId,
          question: trimedText,
          indexes: localCollections.map(c => c.id)
        }
      ),

      reader = response.getReader()

      if (!reader) {
        throw new Error("Failed to read response")
      }

      const decoder = new TextDecoder("utf-8")
      let partialAnswer = ""
      setRunning(false)

      while (true) {

        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        // console.log("Received raw chunk:", chunk)

        const lines = chunk.split("\n")

        lines.forEach((line) => {

          if (!line.startsWith("data:")) return

          const jsonString = line.replace("data:", "").trim()
          if (!jsonString) return

          try {
            const update = JSON.parse(jsonString)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { status, rephrasedQuestion, answer, references, message, id } = update

            setCurrentStatus(message || '')
            // console.log(`status: ${status}, answer: ${answer}, message: ${message}`)

            if (status === MessageStatusEnum.STARTED) {

              if (convId.startsWith('new_') && id) {
                updateDefaultId(convId, id)
              }
              else {
                setLastAnswer(id, '', MessageStatusEnum.STARTED)
              }
            }
            else if (status === MessageStatusEnum.REPHRASED) {
              setLastAnswer(id, '', MessageStatusEnum.REPHRASED)
            }
            else if (status === MessageStatusEnum.RETRIEVING_INDEX) {
              setLastAnswer(id, '', MessageStatusEnum.RETRIEVING_INDEX)
            }
            else if (status === MessageStatusEnum.SEARCHING) {
              setLastAnswer(id, '', MessageStatusEnum.SEARCHING)
            }
            else if (status === MessageStatusEnum.PARTIAL_ANSWER) {

              partialAnswer += answer
              setLastAnswer(id, partialAnswer, MessageStatusEnum.PARTIAL_ANSWER)
            }
            else if (status === MessageStatusEnum.COMPLETED) {

              setLastAnswer(id, answer, MessageStatusEnum.COMPLETED)
              setCurrentStatus('')
              setQueryRunning(false)
            }
            else if (status === MessageStatusEnum.ERROR) {

              setLastAnswer(id, message, MessageStatusEnum.ERROR)
              setCurrentStatus('')
              setQueryRunning(false)
            }

            scrollChatToBottom()
          }
          catch (error) {
            console.error("Error parsing JSON:", error, "Raw Data:", jsonString)
          }
        })
      }
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunning(false)
      setQueryRunning(false)
      setCurrentStatus("")
    }
  },

  renderEmptyConversation = () => (
    <div className="flex justify-center items-center h-full">
      <h1 className="mb-4 text-xl md:text-2xl lg:text-3xl text-center font-extrabold text-gray-900">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
          Start a new Conversation or Pick from your History
        </span>
      </h1>
    </div>
  ),

  renderError = () => (
    <div className="w-full p-1 bg-red-400 shadow-md">
      <div className="flex p-2 items-center justify-between">

        <div className="text-sm ms-2 text-white font-semibold">
          { error ?? globalError }
        </div>

        <div className="inline-flex gap-4">
          <span className="text-white cursor-pointer inline-flex items-center gap-1" onClick={() => {}} title='Retry'>
            <Refresh className="w-5 h-5" />
            Retry
          </span>

          <span className="text-white cursor-pointer" onClick={() => {
            setError(null)
            resetGlobalError()
            }} title='Close'>
            <Close className="w-5 h-5" />
          </span>          
        </div>
      </div>
    </div>
  )

  if (currentStatus) {
    console.log(currentStatus)
  }

  return (
    <div className="h-full flex flex-col">

      <ChatHeader 
        title={ title }
        conversationId={ conversationId }
        deleteConversation={ deleteConversation }
        backClicked={ backClicked }
        openConversationMenu={ openConversationMenu }
        clearConversationHistory={ clearConversationHistory }
        updateConversationData={ updateConversationData }
      />

      { (error || globalError) && renderError() }

      <div ref={ chatRef } className="flex-grow bg-gray-100 my-1 md:my-2 p-2 overflow-y-auto custom-div-scrollbar">

        { !conversationId && renderEmptyConversation() }

        { history.map((msg, index) =>
        msg.role === UserRole.SYSTEM
        ? <MessageItemSystem key={ index } { ...msg } />
        : msg.role === UserRole.USER
        ? <MessageItemUser key={ index } { ...msg } />
        : <MessageItemAssistant key={ index } { ...msg } />
        )}
        { running && !!conversationId && <WaitingSkeleton /> }
      </div>

      <FormChat text={ text }
        textChanged={ setText }
        onSubmit={ onSubmitQuestion }
        running={ queryRunning }
        inputTextRef={ inputTextRef }
        selectedCollections={ currentCollections }
        conversationId={ conversationId }
        setLocalCollections={ setLocalCollections }
        updateConversationData={ updateConversationData }
        dispatch={ dispatch }
        doDeleteRecentQuestionStore={ doDeleteRecentQuestionStore }
        doResetRecentQuestionStore={ doResetRecentQuestionStore }
        recentQuestions={ recentQuestions }
      />
    </div>
  )
}

export default Messages
