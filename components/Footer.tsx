import Link from "next/link"
import info from "@/package.json"

export default function Footer() {

  return (
    <footer className="bg-gray-800 text-white text-center text-sm p-4 mt-auto">
      <p>&copy; 2025 Hermes - v{ info.version }</p>
      <ul className="flex justify-center flex-wrap space-x-4 mt-2">
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/help">Help</Link>
        </li>
        <li>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/contact">Contact Us</Link>
        </li>
      </ul>
    </footer>
  )
}