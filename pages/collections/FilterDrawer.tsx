import { Drawer } from "flowbite-react"
import { JSX } from "react"
import { RiMenu5Line } from "react-icons/ri"

interface FilterDrawerProps {

  isOpen: boolean

  content: JSX.Element

  handleClose: () => void
}

export default function FilterDrawer({ isOpen, handleClose, content }: FilterDrawerProps) {

  return (
    <Drawer open={ isOpen } onClose={ handleClose }>
      <Drawer.Header title="Filters" titleIcon={() => <RiMenu5Line className="size-5 mr-2" />} />
      <Drawer.Items className="space-y-4">
        { content }
      </Drawer.Items>
    </Drawer>
  )
}
