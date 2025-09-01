
import ApiRequest from "@/libs/ApiRequest"
import Conversation from "@/libs/Conversation"
import ConversationMenuProps from "@/libs/ConversationMenuProps"
import { IndexDetails } from "@/libs/IndexDetails"
import { TAP_SCREEN } from "@/libs/TabScreen"
import {
  addUserQuestion,
  QuestionAnswer,
  removeConversation,
  resetConversationsData,
  setLastAnswer,
  setOriginalConversations,
  updateConversation,
  UpdateConversationId,
  updateDefaultId,
  UserQuestion
} from "@/redux/reducers/conversationSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import DrawerMenu from "./DrawerMenu"
import LeftChat from "./Left"
import Messages from "./Messages"
import ChatSettings from "./ChatSettings"
import ConversationContent from "./ConversationContent"
import { sortCollectionByName } from "@/libs/helpers"
import { MessageStatusEnum } from "@/libs/MessageStatusEnum"
import { useAppDispatch } from "@/redux/hooks"
import RecentQuestion from "@/libs/RecentQuestion"
import { addQuestion, deleteQuestion, resetRecentQuestionData } from "@/redux/reducers/recentQuestionSlice"

interface StateProps {

  conversations: Conversation[]

  recentQuestions: RecentQuestion[]
}

interface DispatchProps {

  initConversations: (data: Conversation[]) => void

  doUpdateConversationStore: (conv: Conversation) => void

  doAddUserQuestion: (q: UserQuestion) => void

  doUpdateDefaultId: (d: UpdateConversationId) => void

  doSetLastAnswer: (q: QuestionAnswer) => void

  doRemoveConversation: (id: string) => void

  doResetConversationsData: () => void

  doAddRecentQuestionStore: (q: RecentQuestion) => void,

  doDeleteRecentQuestionStore: (id: string) => void,

  doResetRecentQuestionStore: () => void
}

type Props = StateProps & DispatchProps

function ChatRoom({
  conversations,
  doAddUserQuestion,
  doUpdateDefaultId,
  doSetLastAnswer,
  initConversations,
  doUpdateConversationStore,
  doRemoveConversation,
  doAddRecentQuestionStore,
  doDeleteRecentQuestionStore,
  doResetRecentQuestionStore,
  recentQuestions,
}: Props) {

  const dispatch: AppDispatch = useAppDispatch(),

  [conversationId, setConversationId] = useState<string | undefined>(),

  isNewConversation = !conversationId || conversationId.startsWith("new_"),

  [tab, setTab] = useState<TAP_SCREEN>(TAP_SCREEN.MESSAGES),

  [running, setRunning] = useState<boolean>(false),

  [error, setError] = useState<string | null>(null),

  [runningConv, setRunningConv] = useState<string | null>(null),

  [showDrawerMenu, setShowDrawerMenu] = useState<boolean>(false),

  [localCollections, setLocalCollections] = useState<IndexDetails[]>([]),

  doCloseMenuDrawer = () => setShowDrawerMenu(false),

  router = useRouter(),

  inputTextRef = useRef<HTMLInputElement>(null),

  setFocusToInputText = () => {
    if (inputTextRef.current) {
      inputTextRef.current.focus()
    }
  },

  setNewConversation = () => {
    setTab(TAP_SCREEN.MESSAGES)
    setConversationId(undefined)
    setError(null)
    doCloseMenuDrawer()
    setFocusToInputText()
  },

  doChoseConversation = (id: string) => {
    setTab(TAP_SCREEN.MESSAGES)
    setConversationId(id)
    loadConversation(id)
    doCloseMenuDrawer()
    setFocusToInputText()
  },

  addUserQuestion = (content: string, convId: string) => {

    doAddUserQuestion({ content, convId, collections: localCollections })

    doAddRecentQuestionStore({
      id: new Date().getTime().toString(),
      text: content,
      timestamp: Math.round(Date.now() / 1000)
    })

    if (convId !== conversationId) {
      setConversationId(convId)
    }
  },

  updateDefaultId = (oldId: string, newId: string) => {
    doUpdateDefaultId({ oldId, newId })
    setConversationId(newId)
    setLocalCollections([])
  },

  setLastAnswer = (convId: string, content: string, status: MessageStatusEnum) => {
    doSetLastAnswer({ convId, content, status })
  },

  getUpdatedConversation = async (data: Conversation) => {

    if (data.collections?.length) {
      const collectionData: IndexDetails[] = await ApiRequest.getConversationCollections(dispatch, data.id)
      sortCollectionByName(collectionData)
      data.collectionData = collectionData
    }
  },

  fetchConversations = async () => {

    setRunning(true)
    setError(null)

    try {

      const data: Conversation[] = await ApiRequest.listConversations(dispatch),
      conv = data.find(({ id }) => conversationId === id)

      if (conv) {
        await getUpdatedConversation(conv)
      }

      initConversations(data)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    } 
    finally {
      setRunning(false)
    }
  },

  updateConversationData = async (data: Conversation) => {

    await getUpdatedConversation(data)
    doUpdateConversationStore(data)
  },

  loadConversation = async (convId: string) => {

    setRunningConv(convId)
    setError(null)

    try {

      const data: Conversation = await ApiRequest.getConversationById(dispatch, convId)
      await updateConversationData(data)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunningConv(null)
    }
  },

  doDeleteConversation = async (convId: string) => {

    setRunningConv(convId)
    setError(null)

    try {

      if (!convId.startsWith("new_")) {
        await ApiRequest.deleteConversation(dispatch, convId)
      }

      doRemoveConversation(convId)
      if (convId === conversationId) {
        setConversationId(undefined)
      }
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunningConv(null)
    }
  },

  doAddToLocalCollections = (collections: IndexDetails[]) => setLocalCollections(prev => [...prev, ...collections]),

  doRemoveConversationCollection = async (collectionId: string) => {

    if (isNewConversation) {
      setLocalCollections(prev => prev.filter(item => item.id !== collectionId))
      return
    }

    setRunningConv(conversationId)
    setError(null)

    try {
      const data: Conversation = await ApiRequest.removeCollection(dispatch, conversationId, collectionId)
      await updateConversationData(data)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunningConv(null)
    }
  },

  doClearConversationHistory = async (convId: string) => {

    setRunningConv(convId)
    setError(null)

    try {

      const data: Conversation = await ApiRequest.clearConversationHistory(dispatch, convId)
      await updateConversationData(data)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunningConv(null)
    }
  },

  doRemoveAllConversationCollections = async () => {

    if (isNewConversation) {
      setLocalCollections([])
      return
    }

    setRunningConv(conversationId)
    setError(null)

    try {
      const data: Conversation = await ApiRequest.removeAllConversationCollections(dispatch, conversationId)
      await updateConversationData(data)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setRunningConv(null)
    }
  },

  currentConversation = conversations.find(item => item.id && item.id === conversationId),

  currentCollections = isNewConversation ? localCollections : (currentConversation?.collectionData || []),

  conversationMenuProps: ConversationMenuProps = {
    conversations: conversations,
    activeId: conversationId,
    setConversationId: doChoseConversation,
    newConversation: setNewConversation,
    selectedCollections: currentCollections,
    tabClicked: tab => {
      doCloseMenuDrawer()
      setTab(tab)
    },
    runningId: runningConv,
    runningLoad: running,
    deleteConversation: doDeleteConversation,
    removeSelectedCollection: doRemoveConversationCollection,
    clearConversationHistory: doClearConversationHistory,
    updateConversationData: updateConversationData,
    loadConversations: fetchConversations,
    doRemoveAllConversationCollections: doRemoveAllConversationCollections
  },

  backClicked = () => {
    if (tab !== TAP_SCREEN.MESSAGES) {
      setTab(TAP_SCREEN.MESSAGES)
    }
    else {

      if (conversationId) {
        setNewConversation()
      }
      else {
        router.back()
      }
    }
  }

  useEffect(() => {
    fetchConversations()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(error)

  return <>
    <div className="md:flex bg-white dark:bg-gray-900">

      <div className="w-20 flex-shrink-0 h-screen text-gray-500 hidden md:flex md:flex-col md:items-center md:justify-between py-5">
        <LeftChat
          tabClicked={ setTab }
          backClicked={ backClicked }
        />
      </div>

      <div className="w-80 flex-shrink-0 h-screen bg-gray-100 hidden md:block">
        <ConversationContent { ...conversationMenuProps } />
      </div>

      <div className="md:w-[calc(100vw-320px-80px)] h-screen md:p-2">

        { tab === TAP_SCREEN.SETTINGS
          ? <ChatSettings
              backClicked={ backClicked }
              openConversationMenu={() => setShowDrawerMenu(true)}
            />

          : <Messages
              conversation={ currentConversation }
              localCollections={ localCollections }
              currentCollections={ currentCollections }
              addUserQuestion={ addUserQuestion }
              updateDefaultId={ updateDefaultId }
              setLastAnswer={ setLastAnswer }
              deleteConversation={ doDeleteConversation }
              globalError={ error }
              resetGlobalError={() => setError(null)}
              backClicked={ backClicked }
              openConversationMenu={() => setShowDrawerMenu(true)}
              inputTextRef={ inputTextRef }
              clearConversationHistory={ doClearConversationHistory }
              dispatch={ dispatch }
              setLocalCollections={ doAddToLocalCollections }
              updateConversationData={ updateConversationData }
              doDeleteRecentQuestionStore={ doDeleteRecentQuestionStore }
              doResetRecentQuestionStore={ doResetRecentQuestionStore }
              recentQuestions={ recentQuestions }
            />
        }
      </div>
    </div>

    <DrawerMenu
      isOpen={ showDrawerMenu } 
      handleClose={() => setShowDrawerMenu(false)}
      menuProps={ conversationMenuProps }
    />
  </>
}

const mapStateToProps = (state: RootState) => {
  const { conversations, recentQuestions } = state
  return { conversations, recentQuestions }
},

mapDispatchToProps = (dispatch: AppDispatch) =>({

  initConversations: (data: Conversation[]) => dispatch(setOriginalConversations(data)),

  doUpdateConversationStore: (d: Conversation) => dispatch(updateConversation(d)),

  doAddUserQuestion: (q: UserQuestion) => dispatch(addUserQuestion(q)),

  doUpdateDefaultId: (d: UpdateConversationId) => dispatch(updateDefaultId(d)),

  doSetLastAnswer: (q: QuestionAnswer) => dispatch(setLastAnswer(q)),

  doRemoveConversation: (id: string) => dispatch(removeConversation(id)),

  doResetConversationsData: () => dispatch(resetConversationsData()),

  doAddRecentQuestionStore: (q: RecentQuestion) => dispatch(addQuestion(q)),

  doDeleteRecentQuestionStore: (id: string) => dispatch(deleteQuestion(id)),

  doResetRecentQuestionStore: () => dispatch(resetRecentQuestionData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom)
