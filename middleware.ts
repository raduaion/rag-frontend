import { NextRequest, NextResponse } from 'next/server'
import { ApprovalStatus } from './libs/ApprovalStatus'
import { publicPaths } from './libs/helpers'
import User from './libs/User'

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT,

ACCOUNT_URI = '/account'

export async function middleware(request: NextRequest) {

  let isAuthenticated = false,
  userData: User | null = null

  try {

    const response = await fetch(`${API_ENDPOINT}/api/users/info`, {
      credentials: 'include',
      headers: {
        cookie: request.cookies.toString() || ''
      }
    })

    isAuthenticated = response.ok

    if (isAuthenticated) {
      userData = await response.json()
    }
  }
  catch (error) {
    console.error(error)
  }

  const pathname = request.nextUrl.pathname,

  isPublicRoute = publicPaths.includes(pathname) || pathname.startsWith('/_next') // Next.js internal routes

  if (!isPublicRoute) { // Private routes

    const url = request.nextUrl.clone()

    if (!isAuthenticated ) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
    else if(!pathname.startsWith(ACCOUNT_URI) && userData?.status !== ApprovalStatus.APPROVED) { 

      // Users should be APPROVED to access private routes (except /account)
      url.pathname = ACCOUNT_URI
      return NextResponse.redirect(url)
    }
  }

  // Anything else, continue.
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'], // Match all routes *except* those in the regex
}
