import ButtonRounded from "@/components/fragments/ButtonRounded"
import ArrowLeft from "@/components/fragments/icons/ArrowLeft"
import Cog from "@/components/fragments/icons/Cog"
import HomeOpen from "@/components/fragments/icons/HomeOpen"
import MessageRounded from "@/components/fragments/icons/MessageRounded"
import Shapes from "@/components/fragments/icons/Shapes"
import { TAP_SCREEN } from "@/libs/TabScreen"
import { useRouter } from "next/router"
import { ImFilesEmpty } from "react-icons/im"

interface LeftChatProps {

  className?: string

  tabClicked: (tab: TAP_SCREEN) => void

  backClicked: () => void
}

export default function LeftChat({ tabClicked, backClicked }: LeftChatProps) {

  const router = useRouter()

  return (
    <>
      <ButtonRounded pSmall onClick={ backClicked } title='Back'>
        <ArrowLeft className="size-6" />
      </ButtonRounded>

      <div className="flex flex-col gap-5">

        <ButtonRounded pSmall onClick={() => router.push('/')} title="Go Home">
          <HomeOpen className="size-6" />
        </ButtonRounded>

        <ButtonRounded pSmall onClick={() => router.push('/my-files')} title="Manage files">
          <ImFilesEmpty className="size-5" />
        </ButtonRounded>

        <ButtonRounded pSmall onClick={() => router.push('/collections')} title="Manage collections">
          <Shapes className="size-6" />
        </ButtonRounded>

        <button className="rounded-full text-blue-600 hover:text-gray-700 hover:bg-gray-200 flex flex-col items-center" title="Chat"
          onClick={() => tabClicked(TAP_SCREEN.MESSAGES)}>
          <MessageRounded className="size-6" />
          <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
        </button>
      </div>

      <ButtonRounded pSmall title="Chat settings"
        onClick={() => tabClicked(TAP_SCREEN.SETTINGS)}>
        <Cog className="size-6" />
      </ButtonRounded>
    </>
  )
}
