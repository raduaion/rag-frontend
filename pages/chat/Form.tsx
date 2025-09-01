import CollectionPopover from "@/components/CollectionPopover"
import CookieIcon from "@/components/fragments/icons/CookieIcon"
import MicrophoneIcon from "@/components/fragments/icons/MicrophoneIcon"
import { PlusCircle } from "@/components/fragments/icons/PlusCircle"
import SendIcon from "@/components/fragments/icons/SendIcon"
import RecentTextPopover from "@/components/RecentTextPopover"
import ApiRequest from "@/libs/ApiRequest"
import CollectionPagedResult from "@/libs/CollectionPagedResult"
import Conversation from "@/libs/Conversation"
import { IndexDetails } from "@/libs/IndexDetails"
import RecentQuestion from "@/libs/RecentQuestion"
import { AppDispatch } from "@/redux/store"
import { RefObject, useEffect, useRef, useState } from "react"

interface FormProps {

  text: string

  onSubmit: () => void

  textChanged: (text: string) => void

  running: boolean

  inputTextRef: RefObject<HTMLInputElement | null>

  conversationId: string | undefined

  selectedCollections: IndexDetails[]

  setLocalCollections: (data: IndexDetails[]) => void

  updateConversationData: (data: Conversation) => void

  dispatch: AppDispatch

  doDeleteRecentQuestionStore: (id: string) => void,

  doResetRecentQuestionStore: () => void

  recentQuestions: RecentQuestion[]
}

const SIZE_NAV = 10

export default function FormChat({ text, textChanged, onSubmit, running, inputTextRef, selectedCollections,
  conversationId, setLocalCollections, updateConversationData, dispatch, doDeleteRecentQuestionStore,
  doResetRecentQuestionStore, recentQuestions }: FormProps) {

  const noText = !text || !text.trim(),

  disabledBtn = noText || running,

  [loading, setLoading] = useState(false),

  [creating, setCreating] = useState(false),

  shouldSelect = useRef(false),

  [error, setError] = useState<string | null>(null),

  [originalCollections, setOriginalCollections] = useState<IndexDetails[]>([]),

  [publicCollections, setPublicCollections] = useState<IndexDetails[]>([]),

  [page, setPage] = useState(0),

  [hasNext, setHasNext] = useState(false),

  [totalElements, setTotalElements] = useState(0),

  [pagePublic, setPagePublic] = useState(0),

  [hasNextPublic, setHasNextPublic] = useState(false),

  [totalElementsPublic, setTotalElementsPublic] = useState(0),

  closeError = () => setError(null),

  recentTextSelected = (tt: string) => {

    shouldSelect.current = true
    textChanged((text + ' ' + tt).trim())
  },

  fetchCollections = async () => {

    setLoading(true)
    setError(null)

    try {

      const result: CollectionPagedResult<IndexDetails> = await ApiRequest.filterIndexes(
        dispatch, 
        page,
        SIZE_NAV,
        false
      )

      setOriginalCollections([...originalCollections, ...result.content])
      setPage(result.currentPage + 1)
      setHasNext(result.hasNext)
      setTotalElements(result.totalElements)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setLoading(false)
    }
  },

  fetchPublicCollections = async (isReload: boolean) => {
  
    setLoading(true)
    setError(null)

    try {

      const result: CollectionPagedResult<IndexDetails> = await ApiRequest.filterIndexes(
        dispatch, 
        isReload ? 0 : pagePublic,
        SIZE_NAV,
        true
      )

      setPublicCollections(isReload ? result.content : [...publicCollections, ...result.content])
      setPagePublic(result.currentPage + 1)
      setHasNextPublic(result.hasNext)
      setTotalElementsPublic(result.totalElements)
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setLoading(false)
    }
  },

  doAddConversationCollections = async (collections: IndexDetails[], callBack: () => void) => {

    if (!conversationId || conversationId.startsWith('new_')) {
      setLocalCollections(collections)
      callBack()
      return
    }

    setCreating(true)
    setError(null)

    try {
      const data: Conversation = await ApiRequest.addCollections(dispatch, conversationId, collections.map(item => item.id))
      updateConversationData(data)
      callBack()
    }
    catch (error) {
      console.error(error)
      setError((error as Error).message)
    }
    finally {
      setCreating(false)
    }
  }

  useEffect(() => {

    if (inputTextRef.current && shouldSelect.current) {

      inputTextRef.current.focus()
      inputTextRef.current.select()

      shouldSelect.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  useEffect(() => {
    fetchCollections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-3 md:rounded-xl md:rounded-tr-none md:rounded-tl-none bg-gray-100">

      <div className="max-w-5xl mx-auto md:max-lg:text-center">

        <form className="flex items-center" onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}>

          <CollectionPopover
            conversationId={ conversationId }
            selectedCollections={ selectedCollections }
            originalCollections={ originalCollections }
            fetchCollections={ fetchCollections }
            fetchPublicCollections={ fetchPublicCollections }
            originalPublicCollections={ publicCollections }
            hasNext={ hasNext }
            hasNextPublic={ hasNextPublic }
            totalElements={ totalElements }
            totalElementsPublic={ totalElementsPublic }
            loading={ loading }
            saving={ creating }
            error={ error }
            closeError={ closeError }
            addConversationCollections={ doAddConversationCollections }>
            <button type="button" className="p-1 md:p-2 text-blue-500 hover:text-blue-800">
              <PlusCircle className="size-6" />
            </button>
          </CollectionPopover>

          <div className="relative flex flex-grow p-1 lg:p-2">

            <RecentTextPopover
              recentQuestions={ recentQuestions }
              doDeleteRecentQuestionStore={ doDeleteRecentQuestionStore }
              doResetRecentQuestionStore={ doResetRecentQuestionStore }
              selectedText={ recentTextSelected }>
              <button type="button" className="absolute inset-y-0 start-0 text-gray-500 hover:text-gray-800 ps-5 hidden lg:block">
                <CookieIcon className="size-5" />
              </button>
            </RecentTextPopover>

            <input className="text-gray-700 text-sm p-5 lg:ps-10 pe-10 flex-grow rounded-[50px] focus:outline-none focus:ring-gray-300 border-none bg-white"
              type="text" placeholder="Ask Hermes ..."
              ref={ inputTextRef }
              onChange={e => textChanged(e.target.value)} 
              value={ text }
              autoFocus required
            />

            <button type="button" className="absolute inset-y-0 end-0 hidden lg:flex items-center text-gray-500 hover:text-gray-700 pe-5">
              <MicrophoneIcon className="size-5" />
            </button>

            <button disabled={ disabledBtn } type="submit"
              className="absolute inset-y-0 end-0 lg:hidden flex items-center text-gray-500 hover:text-gray-700 pe-5">
              <SendIcon className="size-5" />
            </button>
          </div>

          <button type="submit" disabled={ disabledBtn }
            className={`hidden lg:inline-flex items-center justify-center h-14 w-14 ms-2 text-white rounded-full border ${ 
            disabledBtn ? 'bg-blue-300': 'bg-blue-700 border-blue-700 hover:bg-blue-800' } focus:ring-4 focus:outline-none focus:ring-blue-300`}>
            <SendIcon className="size-6" />
          </button>

        </form>
      </div>
    </div>
  )
}
