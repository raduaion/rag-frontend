import { FaRegFilePdf } from "react-icons/fa"
import { FaRegFileWord } from "react-icons/fa6"
import { FiFileText } from "react-icons/fi"
import { FaRegFilePowerpoint } from "react-icons/fa6"
import { FaRegFileExcel } from "react-icons/fa"
import { AiOutlineFileMarkdown } from "react-icons/ai"
import { BsFiletypeTxt } from "react-icons/bs"
import { LuFileJson } from "react-icons/lu"
import { FaRegFileImage } from "react-icons/fa"
import { FaRegFile } from "react-icons/fa"
import { IconBaseProps } from "react-icons"

interface IconFileProps extends IconBaseProps {
  filename: string
}

export default function IconFile({ filename, ...rest }: IconFileProps) {

  const parts = filename.split('.'),
  extension = parts[parts.length - 1]

  switch (extension) {

    case 'pdf':
      return <FaRegFilePdf {...rest} />

    case 'docx':
    case 'doc':
      return <FaRegFileWord {...rest} />

    case 'odt':
      return <FiFileText {...rest} />

    case 'pptx':
      return <FaRegFilePowerpoint {...rest} />

    case 'xlsx':
    case 'xlsm':
      return <FaRegFileExcel {...rest} />

    case 'md':
      return <AiOutlineFileMarkdown {...rest} />

    case 'txt':
      return <BsFiletypeTxt {...rest} />

    case 'json':
      return <LuFileJson {...rest} />

    case 'png':
    case 'jpg':
    case 'jpeg':
      return <FaRegFileImage {...rest} />

    default:
      return <FaRegFile {...rest} />
  }
}