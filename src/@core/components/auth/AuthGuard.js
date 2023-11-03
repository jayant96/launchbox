// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

const AuthGuard = props => {
  const { children, fallback } = props
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (!user && !loading) {
      router.replace({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      })
    }
  }, [router, user, loading])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  if (loading) {
    return <Spinner />
  }

  return <>{children}</>
}

export default AuthGuard
