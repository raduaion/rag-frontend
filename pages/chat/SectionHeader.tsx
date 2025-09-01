import ArrowLeft from "@/components/fragments/icons/ArrowLeft"
import MenuLeft from "@/components/fragments/icons/MenuLeft"

interface HeaderSectionProps {
  title: string
  subTitle?: string
  openConversationMenu: () => void
  backClicked: () => void
}

export default function HeaderSection({ title, subTitle, backClicked, openConversationMenu }: HeaderSectionProps) {

  return (
    <div className="text-gray-700">
      <div className="flex items-center">

        <button type="button" onClick={ backClicked } className="p-2 block md:hidden" title='Back'>
          <ArrowLeft className="size-6" />
        </button>

        <button type="button" onClick={ openConversationMenu } className="p-2 block md:hidden" title="Menu">
          <MenuLeft className="size-6" />
        </button>

        <h1 className="text-xl md:text-2xl md:text-center w-full">
          { title }
        </h1>
      </div>

      { !!subTitle &&
      <p className="text-sm text-center text-gray-500">
        { subTitle }
      </p>}
    </div>
  )
}
