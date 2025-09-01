import { ApprovalStatus } from "@/libs/ApprovalStatus"
import { fillingZeroUtility } from "@/libs/helpers"
import { UserApproval } from "@/libs/UserApproval"

interface FooterProps {
  users?: UserApproval[]
}

export default function UserApprovalFooter({ users }: FooterProps) {

  return (
    <div className="inline-flex items-center flex-wrap gap-2 py-4">

      <span>Summary</span>

      <span className="space-x-1">
        <span className="text-sm font-normal text-gray-500">
          Approved:
        </span>
        <span className="text-gray-700">
          { users ? fillingZeroUtility(users.filter(item => item.status === ApprovalStatus.APPROVED).length) : 0 }
        </span>
      </span>

      <span className="text-gray-400">|</span>

      <span className="space-x-1">
        <span className="text-sm font-normal text-gray-500">
          Pending:
        </span>
        <span className="text-gray-700">
          { users ? fillingZeroUtility(users.filter(item => item.status === ApprovalStatus.PENDING).length) : 0 }
        </span>
      </span>

      <span className="text-gray-400">|</span>

      <span className="space-x-1">
        <span className="text-sm font-normal text-gray-500">
          Rejected:
        </span>
        <span className="text-gray-700">
          { users ? fillingZeroUtility(users.filter(item => item.status === ApprovalStatus.REJECTED).length) : 0 }
        </span>
      </span>

    </div>
  )
}
