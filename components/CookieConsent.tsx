import React, { useState, useEffect } from 'react'
import CookieIcon from './fragments/icons/CookieIcon'

const CookieConsent = () => {

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsentAccepted')
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsentAccepted', 'true')
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-200 py-4 px-6 flex items-center justify-between z-50">
      <div className="text-sm text-gray-700">
        <p>
          <CookieIcon className='size-5 text-yellow-400 inline' />
          <CookieIcon className='size-5 text-yellow-400 inline' /> {' '}
          This website uses cookies to enhance your browsing experience. By continuing, you agree to our use of cookies.
          <a href="/privacy-policy" className="text-blue-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
      <button onClick={ handleAcceptCookies }
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Accept
      </button>
    </div>
  )
}

export default CookieConsent