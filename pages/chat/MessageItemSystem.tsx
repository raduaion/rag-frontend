
import { formatChatMessage } from "@/libs/helpers"
import Message from "@/libs/Message"
import moment from "moment"

const MessageItemSystem = ({ content, timestamp }: Message) => (
  <div className="max-w-5xl mx-auto mt-5 mb-2">
    <div className="flex justify-center">

      <div className="text-xs text-center mx-1 py-0.5 px-2 text-gray-500 bg-white rounded-xl"
        title={ timestamp ? moment(timestamp * 1000).format('lll') : '' }
        dangerouslySetInnerHTML={{ __html: formatChatMessage(content) }}
      />
    </div>
  </div>
)

export default MessageItemSystem
