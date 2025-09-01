import Message from "@/components/fragments/icons/Message"
import ConversationMenuProps from "@/libs/ConversationMenuProps"
import { Drawer } from "flowbite-react"
import ConversationContent from "./ConversationContent"

interface DrawerMenuProps {

  isOpen: boolean

  handleClose: () => void

  menuProps: ConversationMenuProps
}

export default function DrawerMenu({ isOpen, handleClose, menuProps }: DrawerMenuProps) {

  return (
    <Drawer open={ isOpen } onClose={ handleClose }>
      <Drawer.Header title="Chat" titleIcon={() => <Message className="size-5 mr-2" />} />
      <Drawer.Items className="h-[calc(100dvh-72px)]">

        <ConversationContent { ...menuProps } />

      </Drawer.Items>
    </Drawer>
  )
}
