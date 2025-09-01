import ArrowRightIcon from '@/components/fragments/icons/ArrowRightIcon'
import User from '@/libs/User'
import Link from 'next/link'

interface WelcomeBackProps {
  userInfo: User | null
}

const WelcomeBack: React.FC<WelcomeBackProps> = ({ userInfo }) => {

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">

      <h1 className="mb-4 text-3xl md:text-4xl font-bold leading-none">
        Welcome Back, {userInfo?.name || 'User'}
      </h1>

      <p className="mb-8 text-lg font-normal lg:text-xl sm:px-16 lg:px-48">
        Upload, manage, and share professional information effortlessly.
      </p>

      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">

        <Link href="/how-it-works" className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
          Get started
          <ArrowRightIcon className="w-3.5 h-3.5 ms-2 rtl:rotate-180" />
        </Link>

        <Link href="/about" className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
          Learn more
        </Link>  
      </div>
    </div>
  )
}
  
export default WelcomeBack
