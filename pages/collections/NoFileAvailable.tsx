import Link from "next/link"

export default function NoFilesAvailable() {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4">
        No files available.<br/> 
        Please <Link href="/my-files" className="text-blue-600">add more files</Link>
      </p>
    </div>
  )
}
