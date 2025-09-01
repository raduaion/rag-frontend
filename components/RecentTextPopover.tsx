import RecentQuestion from "@/libs/RecentQuestion"
import { Popover } from "flowbite-react"
import { ReactNode, useEffect, useState } from "react"
import { LuSearch } from "react-icons/lu"
import { filterRecentQuestions } from "@/libs/helpers"
import { MdOutlineClose } from "react-icons/md"
import moment from "moment"
import ExpandableText from "./fragments/ExpandableText"
import HoverRevealDiv from "./fragments/HoverRevealDiv"
import GenericButton from "./fragments/GenericButton"
import ConfirmDialog from "./fragments/ConfirmDialog"

interface RecentTextPopoverProps {

  children: ReactNode

  recentQuestions: RecentQuestion[]

  doDeleteRecentQuestionStore: (id: string) => void,

  doResetRecentQuestionStore: () => void

  selectedText: (text: string) => void
}

export default function RecentTextPopover({ children, recentQuestions, doDeleteRecentQuestionStore,
  doResetRecentQuestionStore, selectedText }: RecentTextPopoverProps) {

  const [questions, setQuestions] = useState<RecentQuestion[]>([]),

  [searchText, setSearchText] = useState(''),

  [confirmDeleteAll, setConfirmDeleteAll] = useState(false),

  questionsLength = recentQuestions.length

  useEffect(() => {
    setQuestions(filterRecentQuestions(recentQuestions, searchText))
  }, [recentQuestions, searchText])

  const renderTitle = () => (
    <div className="flex items-center justify-between gap-1 flex-wrap min-h-10">

      <h4 className="text-gray-600 text-sm">Recent questions</h4>

      <GenericButton type="button" onClick={() => setConfirmDeleteAll(true)} 
        title='Clear all' disabled={ !questionsLength }
        className="hover:bg-gray-100 p-1.5 px-3 rounded-3xl" >
        <span className="text-blue-600 text-sm">Clear history</span>
      </GenericButton>
    </div>
  ),

  renderSearchZone = () => (
    <label className="flex items-center relative mb-2">

      <LuSearch className="size-4 absolute text-gray-500" />

      <input
        value={ searchText }
        onChange={e => setSearchText(e.target.value)}
        placeholder="Search.."
        className="text-gray-700 p-1 px-6 text-sm focus:outline-none border-b border-transparent focus:border-gray-200 bg-white flex-grow"
        autoFocus
      />

      { !!searchText && <MdOutlineClose onClick={() => setSearchText('')}
        className='size-4 absolute right-0 text-gray-400 hover:text-blue-800' /> }
    </label>
  ),

  renderNoData = () => !questionsLength && (
    <p className="text-gray-500 text-sm text-center my-5">
      No recent questions!
    </p>
  ),

  renderData = () => !!questionsLength && (
    <ul className="space-y-1.5">

    { questions.map(({ id, text, timestamp }) => (

      <li key={ id } onClick={() => selectedText(text)} className="cursor-pointer" title={ text }>

        <HoverRevealDiv
          mainContent={<>
            <ExpandableText text={ text } className="text-teal-800 text-sm" />
            <p className="text-gray-500 text-xs text-right pt-1" title={ moment(timestamp * 1000).format('LLL') }>
              { moment(timestamp * 1000).fromNow(true) }
            </p>
          </>}

          actionElement={
            <GenericButton type="button" className="bg-white p-2.5 rounded-full hover:bg-gray-200"
              onClick={() => doDeleteRecentQuestionStore(id)} title="Delete this question">
              <MdOutlineClose className="size-5 text-gray-500" />
            </GenericButton>
          }
          className="p-2 sm:p-3 border rounded-lg hover:bg-gray-100"
        />
      </li>))
    }
    </ul>
  ),

  renderContent = () => (
    <div className="w-80 p-3">

      { renderTitle() }

      { renderSearchZone() }

      <div className="min-h-[25vh] max-h-[40vh] overflow-auto custom-div-scrollbar">
        { renderNoData() }
        { renderData() }
      </div>

      <ConfirmDialog
        open={ confirmDeleteAll }
        close={() => setConfirmDeleteAll(false)}
        text={`Are you sure you want to delete all recent questions?`}
        proceed={() => {
          setConfirmDeleteAll(false)
          doResetRecentQuestionStore()
        }}
      />
    </div>
  )

  return (
    <Popover trigger="click"
      content={ renderContent() }
      placement="top">
      { children }
    </Popover>
  )
}
