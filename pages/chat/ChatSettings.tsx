import ChatContainer from "./ChatContainer"

interface ChatSettingsProps {
  openConversationMenu: () => void
  backClicked: () => void
}

export default function ChatSettings({ backClicked, openConversationMenu }: ChatSettingsProps) {

  return (
    <ChatContainer
      title="Chat Settings" 
      subTitle="Configure your chat options"
      backClicked={ backClicked } 
      openConversationMenu={ openConversationMenu }>

    </ChatContainer>
  )
}
