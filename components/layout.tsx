import { API_ENDPOINT, publicPaths } from "@/libs/helpers"
import User from "@/libs/User"
import UserAccount from "@/libs/UserAccount"
import { handleFetchStatusCode, setApiAccessible, setAuthenticated, setUserAccount } from "@/redux/reducers/accountSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import CustomNavbar from "./CustomNavbar"
import Footer from "./Footer"
import InaccessibleAccessDialog from "./fragments/InaccessibleAccessDialog"
import UserLoggedOutDialog from "./fragments/UserLoggedOutDialog"
import CookieConsent from "./CookieConsent"
import FetchError from "@/libs/FetchError"
import ApiRequest from "@/libs/ApiRequest"
import { useAppDispatch } from "@/redux/hooks"

interface StateProps {
  account: UserAccount
}

interface DispatchProps {

  doSetUserAccount: (user: User | null | undefined) => void

  doSetApiAccessible: (status: boolean) => void

  doSetAuthenticated: (v: boolean | undefined) => void
}

interface LayoutProps {

  children: ReactNode

  className?: string

  onlyLayout?: boolean
}

type Props = LayoutProps & StateProps & DispatchProps

const RETRY_DURATION_SECOND = 16, // 16 sec

CHECK_DURATION_SECOND = 5 * 60 // 05 min

function Layout({ children, className, onlyLayout, account: { apiAccessible, userData, authenticated },
  doSetUserAccount, doSetApiAccessible, doSetAuthenticated }: Props) {

  const dispatch: AppDispatch = useAppDispatch(),

  statusCheckTimeout = useRef<NodeJS.Timeout | undefined>(undefined),

  countdownInterval = useRef<NodeJS.Timeout | undefined>(undefined),

  [retryTime, setRetryTime] = useState<number>(RETRY_DURATION_SECOND),

  [retryDuration, setRetryDuration] = useState<number>(RETRY_DURATION_SECOND),

  router = useRouter(),

  checkLoginStatus = async (nextDuration: number) => {

    let user: User | null = null,
    isApiAccessible = false

    try {
      user = await ApiRequest.getUserInfo(dispatch)
      dispatch(handleFetchStatusCode(200))
      isApiAccessible = true
    }
    catch (e) {

      console.error(e)
      if (e instanceof FetchError) {
        isApiAccessible = e.statusCode === 401
      }
    }

    if (statusCheckTimeout.current) {
      clearTimeout(statusCheckTimeout.current)
      statusCheckTimeout.current = undefined
    }

    let duration = isApiAccessible ? RETRY_DURATION_SECOND : nextDuration
    duration = duration > 300 ? 300 : duration
    setRetryDuration(duration)
    setRetryTime(duration)

    statusCheckTimeout.current = setTimeout(
      () => checkLoginStatus(duration * (isApiAccessible ? 1 : 2)),
      (isApiAccessible ? CHECK_DURATION_SECOND : duration) * 1000
    )

    doSetApiAccessible(isApiAccessible)
    doSetUserAccount(user)
  }

  useEffect(() => {

    if (apiAccessible) {
      clearInterval(countdownInterval.current)
      countdownInterval.current = undefined
    }
    else {
      countdownInterval.current = setInterval(() => {
        setRetryTime((prev) => (prev > 0 ? prev - 1 : retryDuration))
      }, 1000)
    }

    return () => {
      clearInterval(countdownInterval.current)
      countdownInterval.current = undefined
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiAccessible])

  useEffect(() => {

    checkLoginStatus(RETRY_DURATION_SECOND)

    return () => {
      clearTimeout(statusCheckTimeout.current)
      statusCheckTimeout.current = undefined
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (): Promise<void> => {

    if (!apiAccessible) return

    try {
      const response = await fetch(`${API_ENDPOINT}/api/users/info`, {
        credentials: 'include',
      })

      if (response.ok || response.status === 401) {
        window.location.href = `${API_ENDPOINT}/oauth2/authorization/google?requester=${encodeURIComponent(window.location.href)}`
      }
      else {
        throw new Error(`API inaccessible with status: ${response.status}`)
      }
    }
    catch (error) {
      console.warn('Error during login check:', error)
      doSetApiAccessible(false)
    }
  },

  handleManualRetry = () => {
    checkLoginStatus(RETRY_DURATION_SECOND)
  },

  logoutUser = async () => {

    try {

      const response = await fetch(`${API_ENDPOINT}/api/users/logout?redirect_uri=${encodeURIComponent(window.location.href)}`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Logout failed:', response.statusText)
        return
      }

      doSetUserAccount(null)
      router.push('/')
    }
    catch (error) {
      console.error('Error during logout:', error)
    }
  },

  shouldShowLoginDialog = !!apiAccessible && !authenticated && !publicPaths.includes(router.pathname)

  if (userData === undefined || apiAccessible === undefined || authenticated === undefined) return null
  return (
    <div className="min-h-screen flex flex-col">

      { !onlyLayout &&
      <CustomNavbar
        user={ userData ?? null }
        apiAccessible={ !!apiAccessible }
        login={ handleLogin }
        logout={ logoutUser }
      />}

      <main className={ className }>
        { children }
      </main>

      { !apiAccessible &&
      <InaccessibleAccessDialog
        retryNow={ handleManualRetry }
        retryTime={ retryTime } 
      />}

      <UserLoggedOutDialog
        openModal={ shouldShowLoginDialog }
        closeModal={() => {}}
        login={() => {
          handleLogin()
          doSetAuthenticated(undefined)
        }}
      />

      { !onlyLayout && <Footer /> }

      <CookieConsent />
    </div>
  )
}

const mapStateToProps = (state: RootState) => {
  const { account } = state
  return { account }
},

mapDispatchToProps = (dispatch: AppDispatch) =>({

  doSetUserAccount: (user: User | null | undefined) => dispatch(setUserAccount(user)),

  doSetApiAccessible: (status: boolean) => dispatch(setApiAccessible(status)),

  doSetAuthenticated: (state: boolean | undefined) => dispatch(setAuthenticated(state)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
