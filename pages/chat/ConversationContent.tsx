import { useState } from "react"
import Cog from "@/components/fragments/icons/Cog"
import HomeOpen from "@/components/fragments/icons/HomeOpen"
import Plus from "@/components/fragments/icons/Plus"
import { TAP_SCREEN } from "@/libs/TabScreen"
import Link from "next/link"
import ConversationItem from "./ConversationItem"
import SearchIcon from "@/components/fragments/icons/SearchIcon"
import ButtonRounded from "@/components/fragments/ButtonRounded"
import Close from "@/components/fragments/icons/Close"
import ConversationMenuProps from "@/libs/ConversationMenuProps"
import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import { Spinner } from "flowbite-react"
import Refresh from "@/components/fragments/icons/Refresh"
import HorizontalScrollSnap from "@/components/HorizontalScrollSnap"
import { IndexDetails } from "@/libs/IndexDetails"
import CollectionDetailsCard from "../collections/CollectionDetailsCard"
import DropdownChatCollection from "./DropdownChatCollection"
import { convertTimestampToLocalDate } from "@/libs/helpers"

export default function ConversationContent({ conversations, activeId, setConversationId, newConversation, tabClicked,
  selectedCollections, runningLoad, runningId, deleteConversation, removeSelectedCollection, clearConversationHistory,
  updateConversationData, loadConversations, doRemoveAllConversationCollections }: ConversationMenuProps) {

  const [confirmRemoveCollection, setConfirmRemoveCollection] = useState<string | null>(null),

  [showCollectionCard, setshowCollectionCard] = useState<IndexDetails | null>(null),

  renderConversations = () => conversations && conversations.map((item, index) => (
    <ConversationItem
      key={ index }
      conversation={ item }
      active={ activeId === item.id }
      onSelect={() => setConversationId(item.id)}
      runningId={ runningId }
      deleteConversation={ deleteConversation }
      clearConversationHistory={ clearConversationHistory }
      updateConversationData={ updateConversationData }
    />
  )),

  renderCollections = () => {

    if (!selectedCollections || !selectedCollections.length) return null

    return (
      <HorizontalScrollSnap>
      { selectedCollections.map(({ id, name, createdAt }, index) => (
        <span key={ index }
          className="text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-3xl pl-3 pr-1 py-1 cursor-pointer hover:bg-gray-50 flex items-center"
          title={`${ name } - ${ convertTimestampToLocalDate(parseInt(createdAt, 10), true) }`}
          onClick={e => {
            e.stopPropagation()
            setshowCollectionCard(selectedCollections[index])
          }}>

          <span className="truncate w-full text-center">
            { name }
          </span>

          <ButtonRounded onClick={() => setConfirmRemoveCollection(id)} title='Remove' disabled={ !!runningId }>
            <Close className='size-4 text-gray-400' />
          </ButtonRounded>
        </span>
      ))}
      </HorizontalScrollSnap>
    )
  }

  return (
    <div className="h-full flex flex-col space-y-5 md:p-3">

      <div className="inline-flex items-center justify-between w-full">

        <span className="text-xl font-extrabold text-gray-600 cursor-pointer"
          onClick={() => tabClicked(TAP_SCREEN.MESSAGES)}>
          Conversations
        </span>

        <button type="button" className="inline-flex items-center text-gray-900 border hover:bg-gray-50 focus:ring-1 rounded-lg text-sm px-3 py-1"
          title="New Conversation" onClick={ newConversation }>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex">

        <button type="button" className="absolute inset-y-0 start-0 flex items-center ps-4">
          <SearchIcon className="size-4 text-gray-500" />
        </button>

        <input className="text-gray-700 text-sm ps-10 p-3 focus:outline-none bg-gray-200 w-full rounded-full border-none focus:ring-gray-300"
          type="text" placeholder="Search messages" />
      </div>

      <div className="flex justify-between items-center text-gray-600 h-9">

        <span className="text-lg font-semibol">
          History
        </span>

        { runningLoad
        ? <span className="p-2"><Spinner aria-label="Running" className="size-5" /></span> 
        : <ButtonRounded onClick={ loadConversations } title='Refresh list' disabled={ runningLoad }>
            <Refresh className='size-5' />
          </ButtonRounded>
        }
      </div>

      <div className="space-y-2 md:space-y-3 flex-grow overflow-y-auto custom-div-scrollbar">
        { renderConversations() }
      </div>

      <div className="inline-flex items-center justify-between">

        <span className="font-semibol text-gray-600"
          title='Collections used in the current chat'>
          Chat collections
        </span>

        <DropdownChatCollection
          deleteAllCollections={ doRemoveAllConversationCollections }
          disabled={ !!runningId || !selectedCollections || !selectedCollections.length }
        />
      </div>

      { renderCollections() }
      <hr/>

      <div className="inline-flex items-center justify-center w-full gap-4 text-sm text-gray-500">

        <Link href='/' className="inline-flex items-center gap-1" title="Go Home">
          <HomeOpen className="size-4" /> Home
        </Link>

        <button type="button" className="inline-flex items-center gap-1" onClick={() => tabClicked(TAP_SCREEN.SETTINGS)} title="Chat settings">
          <Cog className="size-4" /> Settings
        </button>
      </div>

      { !!confirmRemoveCollection &&
      <ConfirmDialog
        open={ !!confirmRemoveCollection }
        close={() => setConfirmRemoveCollection(null)}
        text={`Are you sure you want to remove this collection?`}
        proceed={() => {
          setConfirmRemoveCollection(null)
          removeSelectedCollection(confirmRemoveCollection) }
        }
      />}

      { !!showCollectionCard &&
      <CollectionDetailsCard
        open={ !!showCollectionCard }
        close={() => setshowCollectionCard(null)}
        collection={ showCollectionCard }
        isPublicPath={ true }
      />}
    </div>
  )
}
