
"use client"

import { Alert, Avatar, Dropdown, Navbar } from "flowbite-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { JSX, useState } from "react"
import ConfirmDialog from "./fragments/ConfirmDialog"
import User from "@/libs/User"
import { usePathname } from "next/navigation"
import Google from "./fragments/icons/Google"
import Exclamation from "./fragments/icons/Exclamation"
import { ApprovalStatus } from "@/libs/ApprovalStatus"
import { ImFilesEmpty } from "react-icons/im"
import { GoHome } from "react-icons/go"
import { RiQuestionLine } from "react-icons/ri"
import { LuShapes } from "react-icons/lu"
import { RiMessage2Line } from "react-icons/ri"
import { FaUserFriends } from "react-icons/fa"

interface CustomNavbarProps {

  apiAccessible: boolean

  user: User | null

  logout: () => Promise<void>

  login: () => Promise<void>
}

const adminEmail = process.env.NEXT_PUBLIC_DEFAULT_ADMIN_EMAIL

export default function CustomNavbar({ apiAccessible, login, logout, user } : CustomNavbarProps) {
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false),

  router = useRouter(),

  pathname = usePathname(),

  isHome = () => pathname === '/',

  isHowItWorks = () => pathname.indexOf('/how-it-works') != -1,

  isMyFiles = () => pathname.indexOf('/my-files') != -1,

  isCollections = () => pathname.indexOf('/collections') != -1,

  isChat = () => pathname.indexOf('/chat') != -1,

  isUsers = () => pathname.indexOf('/users') != -1,

  isAdmin = user?.email === adminEmail,

  isApproved = user?.status === ApprovalStatus.APPROVED,

  handleLogout = async () => logout().finally(() => setShowConfirmDialog(false)),

  renderLoginButton = () => (
    <button type="button"
      className={`bg-white text-blue-600 px-4 py-2 rounded inline-flex items-center ${ !apiAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={ login }
      disabled={ !apiAccessible }>
      <Google className="size-5 mr-2" />
      <span>Login with Google</span>
    </button>
  ),

  renderMenuItem = (url: string, text: string, active: boolean, icon?: JSX.Element, className?: string) =>
    <Link href={ url } className={`p-2 text-lg flex items-center gap-1 ${ className ?? '' } ${ active ? 'text-amber-200' : 'text-white hover:text-amber-200'}`} aria-current="page">
      { icon } <span>{ text }</span>
    </Link>,

  renderUserDropdown = () => (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <Avatar alt="User settings" img={ user?.picture } rounded />
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{ user?.name }</span>
        <span className="block truncate text-sm font-medium">{ user?.email }</span>
      </Dropdown.Header>

      <Dropdown.Item onClick={() => router.push('/account')}>Account</Dropdown.Item>
      <Dropdown.Item disabled>Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => setShowConfirmDialog(true)}>
        Sign out
      </Dropdown.Item>
    </Dropdown>
  ),

  renderUserStatus = () => {

    if (isApproved || !user) {
      return null
    }

    const statusCap = user.status?.toUpperCase(),

    userStatus = statusCap === ApprovalStatus.APPROVED
    ? { color: 'success', title: 'Approved' }
    : statusCap === ApprovalStatus.REJECTED
      ? { color: 'failure', title: 'Rejected' }
      : { color: 'gray', title: 'under review' }

    return (
      <Alert color={ userStatus?.color }
        icon={() => <Exclamation className="w-6 h-6" />}
        className="me-2 py-2.5">
        <span className="ms-2 font-semibold">Account { userStatus?.title }</span>
        <Link href="/account" className="ms-3" title="More info">More info</Link>
      </Alert>
    )
  }

  return (
    <Navbar fluid className="bg-blue-600 text-white w-full z-20 top-0 start-0 border-b border-gray-200 py-2">

      <Navbar.Brand href="#" onClick={() => router.push('/')}>
        <Image src="/img/HermesLogo.png" className="size-11 sm:size-12 -mt-4 -mb-4 mr-3 rounded-full" alt="Hermes Logo" width={72} height={72} />
        <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap">Hermes</span>
      </Navbar.Brand>

      <div className="flex md:order-2">

        { renderUserStatus() }

        { user ? renderUserDropdown() : renderLoginButton() }

        <Navbar.Toggle className="ml-2 text-gray-300 hover:text-gray-500" />
      </div>

      <Navbar.Collapse>

        { renderMenuItem('/', 'Home', isHome(), <GoHome className="size-5" />, 'md:max-xl:hidden') }

        { renderMenuItem('/how-it-works', 'How It Works', isHowItWorks(), <RiQuestionLine className="size-5" />, 'md:max-xl:hidden') }
  
        { !!user && isApproved && <>
        { renderMenuItem('/my-files', 'My Files', isMyFiles(), <ImFilesEmpty className="size-4" />) }

        { renderMenuItem('/collections', 'Collections', isCollections(), <LuShapes className="size-5" />) }

        { renderMenuItem('/chat', 'Chat', isChat(), <RiMessage2Line className="size-5" />) }

        { isAdmin && renderMenuItem('/users', 'Users', isUsers(), <FaUserFriends className="size-5" />) }

        </>}
      </Navbar.Collapse>

      <ConfirmDialog 
        open={ showConfirmDialog }
        close={() => setShowConfirmDialog(false)}
        text="Are you sure you want to sign out?"
        proceed={ handleLogout }
      />
    </Navbar>
  )
}
