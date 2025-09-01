import SearchIcon from "./icons/SearchIcon";

interface SearchBarProps {
  text: string
  onChange: (text: string) => void
  submit: () => void,
  placeholder: string
  disabled?: boolean
}

export default function SearchBar({ submit, onChange, text, placeholder, disabled }: SearchBarProps) {

  return (
    <form className="max-w-md flex-grow" onSubmit={e => { e.preventDefault(); submit() } }>   

      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>

      <div className="relative">

        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <SearchIcon className="size-4 text-gray-500" />
        </div>

        <input type="search" id="default-search" 
          className="block w-full px-4 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-200 focus:border-blue-200"
          placeholder={ placeholder }
          onChange={e => onChange(e.target.value)}
          value={ text }
          required
          disabled={ disabled }
        />
      </div>
    </form>
  )
}
