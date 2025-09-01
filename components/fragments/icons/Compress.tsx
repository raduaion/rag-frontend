import IconProps from "./IconProps"

export default function Compress({ className }: IconProps) {

  return (
    <svg className={ className } aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4"/>
    </svg>
  )
}