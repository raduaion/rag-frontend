import Exclamation from "@/components/fragments/icons/Exclamation"
import UserIcon from "@/components/fragments/icons/UserIcon"
import { ApprovalStatus } from "@/libs/ApprovalStatus"
import User from "@/libs/User"
import { Alert } from "flowbite-react"

interface UserAccountProps {
  user: User | null | undefined
}

export default function ManageUserAccount({ user }: UserAccountProps) {

  const renderStatus = () => user === undefined
    ? <p className="text-gray-600 text-sm md:mb-5 mb-4">Running...</p>
    : !user && <Alert color="warning" icon={() => <Exclamation className="w-6 h-6" />}
      className="mb-4">&nbsp; User not found!
  </Alert>,

  renderUserStatus = () => {

    const statusCap = user?.status?.toUpperCase(),

    statusText = statusCap === ApprovalStatus.APPROVED 
      ? 'You can now access all features of Hermes.'
      : 'Please contact your Admin for more information.',

    userStatus = statusCap === ApprovalStatus.APPROVED
    ? { color: 'success', title: 'Approved' }
    : statusCap === ApprovalStatus.REJECTED
      ? { color: 'failure', title: 'Rejected' }
      : statusCap === ApprovalStatus.PENDING
        ? { color: 'gray', title: 'Under review' }
        : null

    return !!userStatus && (
      <Alert color={ userStatus?.color } 
        icon={() => <Exclamation className="w-6 h-6" />}
        className="mb-4"
        additionalContent={<p>{ statusText }</p>}>
        &nbsp; <span className="font-semibold">Account { userStatus?.title }</span>
      </Alert>
    )
  },

  renderBody = () => (
    <div className="sm:flex sm:items-center max-w-2xl mx-auto">

      <div className="hidden sm:block text-gray-400">
        <UserIcon className="size-24" />
      </div>

      <div className="space-y-2 flex-grow">
        { !user 
          ? renderStatus() 
          : <>
          { renderUserStatus() }
          <p><span className="font-semibold">Name:</span> { user.name }</p>
          <p><span className="font-semibold">Email:</span> { user.email }</p>
        </>}
      </div>
    </div>
  )

  return (
    <section className="mx-auto max-w-screen-xl">

      <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg p-6 m-4">
        { renderBody() }
      </div>
    </section>
  )
}
