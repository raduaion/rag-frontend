import { formatChatMessage } from "@/libs/helpers"
import Message from "@/libs/Message"

const MessageItemUser = ({ content }: Message) => (
  <div className="max-w-5xl mx-auto mt-5 mb-2">
    <div className="flex justify-end">
      <div className="text-sm p-4 m-1 text-gray-700 bg-[#e9eef6] rounded-xl rounded-br-none max-w-[75%]"
        dangerouslySetInnerHTML={{ __html: formatChatMessage(content) }}
      />
    </div>
  </div>
)

export default MessageItemUser
