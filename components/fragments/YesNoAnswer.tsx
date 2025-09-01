import { Button } from "flowbite-react"

interface YesNoAnswerProps {
  text: string
  proceed: () => void
  cancel: () => void
}

export default function YesNoAnswer({ text, proceed, cancel }: YesNoAnswerProps) {
  return (
    <div className="text-center">

      <h3 className="mb-5 text-lg font-normal text-gray-600">
        { text }
      </h3>

      <div className="flex justify-center gap-4">
        <Button color="failure" onClick={ proceed } pill>
          Yes
        </Button>
        <Button color="gray" onClick={ cancel } pill>
          No
        </Button>
      </div>
    </div>
  )
}
