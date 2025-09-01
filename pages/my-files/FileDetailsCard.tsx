import CustomTimelineItem from "@/components/CustomTimelineItem"
import { CustomBadge, getBadgeState } from "@/components/fragments/CustomBadge"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import IconFile from "@/components/IconFile"
import MenuDropdown from "@/components/MenuDropdown"
import { FileDetails } from "@/libs/FileDetails"
import { FileStatus } from "@/libs/FileStatus"
import { convertTimestampToLocalDate, getFileStatus } from "@/libs/helpers"
import { Modal, Spinner, Timeline } from "flowbite-react"
import moment from "moment"

interface FileDetailsProps {

  open: boolean

  close: () => void

  file: FileDetails

  doDelete: () => void

  doReloadFile: () => void

  running: boolean
}

export default function FileDetailsCard({ open, close, doDelete, doReloadFile, running,
  file: { originalName, dateUploaded, metadata, sizeReadable }}: FileDetailsProps) {

  const createdAtNb = parseInt(dateUploaded, 10),

  createdAtStr = convertTimestampToLocalDate(createdAtNb, true),

  getFileStatusTime = (data: Record<string, string>): string => data.statusChangeTimestamp,

  fileStatusTime = metadata ? getFileStatusTime(metadata) : null,

  fileStatusStr = fileStatusTime ? moment(Number(fileStatusTime) * 1000).format('lll') : '',

  fileStatus = getFileStatus(metadata),

  noRefresh = fileStatus === FileStatus.PROCESSED || fileStatus === FileStatus.ERROR,

  renderItem = (title: string, content: string) => (
    <div className="sm:flex w-full text-sm">
      <p className="sm:w-1/4 font-semibold">{ title }</p>
      <p className="w-full text-gray-600">{ content }</p>
    </div>
  )

  return (
    <Modal show={ open } size="3xl" onClose={ close } popup dismissible>

      <Modal.Header />

      <Modal.Body>

        <div className="sm:flex sm:gap-2 text-gray-700">

          <IconFile filename={ originalName } size={72} className="size-14 text-gray-400 hidden sm:block" />

          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              { originalName }
            </h2>

            <div className="inline-flex items-center gap-3 flex-wrap">

              <span className="text-orange-600 text-sm">
                { sizeReadable }
              </span>

              <VerticalSeparator />

              <span className="text-gray-500 text-sm" title={ createdAtStr }>
                { moment(createdAtNb * 1000).fromNow() }
              </span>

              <VerticalSeparator />

              <CustomBadge
                statusText={ fileStatus }
                state={ getBadgeState(fileStatus) }
              />

              <MenuDropdown
                running={ running }
                noRefresh={ noRefresh || running }
                doRefresh={ doReloadFile }
                doRemove={ doDelete }
              />

              { running && <Spinner aria-label="Running" className="ms-1" /> }
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 mt-5">
          <Timeline horizontal>
            <CustomTimelineItem time={ createdAtStr } body='Uploaded' />
            <CustomTimelineItem time={ fileStatusStr } body='Status updated' />
          </Timeline>
        </div>

        <div className="bg-gray-50 p-4 border-t space-y-4 sm:space-y-8">
          { renderItem('Keywords', metadata ? metadata.keywords : '') }
          { renderItem('Status Reason', metadata ? metadata.statusReason : '') }
        </div>
      </Modal.Body>
    </Modal>
  )
}
