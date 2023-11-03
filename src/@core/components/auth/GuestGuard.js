// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

const GuestGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  // console.log("Gauest Guard", auth)
  useEffect(() => {
    // console.log("I am in guestGuard", auth)
    if (!router.isReady) {
      return
    }

    if (!auth.loading && auth.user !== null) {
      router.replace('/home/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, auth])

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
