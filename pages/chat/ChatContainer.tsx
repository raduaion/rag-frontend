import { ReactNode } from 'react'
import HeaderSection from "./SectionHeader"

interface ChatContainerProps {

  title: string

  subTitle?: string

  children?: ReactNode

  openConversationMenu: () => void

  backClicked: () => void
}

export default function ChatContainer({ title, subTitle, openConversationMenu, backClicked, children }: ChatContainerProps) {

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">

      <div className="bg-white rounded-lg md:my-2 pt-2 md:pt-5 min-h-52 max-w-5xl mx-auto">

        <HeaderSection
          title={ title }
          subTitle={ subTitle }
          backClicked={ backClicked }
          openConversationMenu={ openConversationMenu }
        />

        { children }

      </div>
    </div>
  )
}
