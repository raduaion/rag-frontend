import { useState } from "react"
import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import { Dropdown } from "flowbite-react"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { HiOutlineTrash } from "react-icons/hi2"

interface DropdownChatCollectionProps {
  deleteAllCollections: () => void
  disabled?: boolean
}

export default function DropdownChatCollection({ deleteAllCollections, disabled }: DropdownChatCollectionProps) {

  const [confirmDelete, setConfirmDelete] = useState(false)

  return <div onClick={e => e.stopPropagation()}>
    <Dropdown label=""
      renderTrigger={() =>
        <span className={`p-2 block cursor-pointer rounded-full text-gray-500 hover:bg-gray-200`}>
          <HiOutlineDotsHorizontal className="size-5" />
        </span>
      }>

      <Dropdown.Item onClick={() => setConfirmDelete(true)} disabled={ disabled }
        className={`${ disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600' }`}>
        <HiOutlineTrash className="size-4 me-2" /> Delete all collections
      </Dropdown.Item>
    </Dropdown>

    <ConfirmDialog
      open={ confirmDelete }
      close={() => setConfirmDelete(false)}
      text={`Delete all collections from this conversation?`}
      proceed={() => {
        setConfirmDelete(false)
        deleteAllCollections()
      }}
    />
  </div>
}
