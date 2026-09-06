import { useEffect, useState } from 'react'

const MOBILE_USER_AGENT = /Android|BlackBerry|HarmonyOS|HuaweiBrowser|IEMobile|iPad|iPhone|iPod|Mobile|OpenHarmony|Opera Mini|webOS/i

function detectMobileDevice() {
  if (typeof window === 'undefined') return false

  const userAgent = navigator.userAgent || ''
  const mobileUserAgent = navigator.userAgentData?.mobile === true || MOBILE_USER_AGENT.test(userAgent)
  const desktopIPadUserAgent = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1
  return window.matchMedia('(max-width: 767px)').matches || mobileUserAgent || desktopIPadUserAgent
}

export default function useMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = useState(detectMobileDevice)

  useEffect(() => {
    const widthQuery = window.matchMedia('(max-width: 767px)')
    const syncDevice = () => setIsMobileDevice(detectMobileDevice())

    window.addEventListener('resize', syncDevice)
    widthQuery.addEventListener('change', syncDevice)
    return () => {
      window.removeEventListener('resize', syncDevice)
      widthQuery.removeEventListener('change', syncDevice)
    }
  }, [])

  return isMobileDevice
}
