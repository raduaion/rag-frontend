import { formatChatMessage, getMessageStatusText } from "@/libs/helpers"
import Message from "@/libs/Message"
import { MessageStatusEnum } from "@/libs/MessageStatusEnum"
import { Spinner } from "flowbite-react"
import moment from "moment"
import Image from "next/image"

const MessageItemAssistant = ({ content, timestamp, status }: Message) => (
  <div className="max-w-5xl mx-auto mt-5">
    <div className="flex">

      <Image src="/img/HermesLogo.png"
        className="w-6 h-6 sm:w-8 sm:h-8 m-1 sm:m-3 rounded-full" alt="avatar" width={32} height={32}
      />

      <div className="flex-grow">
        <div className="text-sm p-4 text-gray-700 bg-white rounded-2xl rounded-bl-none"
          dangerouslySetInnerHTML={{ __html: formatChatMessage(content) }} />

        <p className="text-xs text-gray-500 text-center my-2">
          { (status && status !== MessageStatusEnum.COMPLETED && status !== MessageStatusEnum.ERROR)
          ? <><Spinner aria-label="Running" className="size-5 me-1"/> { getMessageStatusText(status) }</>
          : timestamp ? moment(timestamp * 1000).format('lll') : ''
          }
        </p>
      </div>
    </div>
  </div>
)

export default MessageItemAssistant
