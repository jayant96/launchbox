// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Firebase Imports
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onIdTokenChanged,
  onAuthStateChanged
} from 'firebase/auth'

import { collection, doc, setDoc, getDoc } from 'firebase/firestore'

import { db } from 'src/configs/firebase'
import { auth } from 'src/configs/firebase'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  passwordReset: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      onAuthStateChanged(auth, async firebaseUser => {
        if (firebaseUser) {
          // Fetch additional user data from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            // Store additional user data in user state
            setUser({ ...firebaseUser, ...docSnap.data() })
          } else {
            console.log('No such document!')
          }
        } else {
          setUser(null)
        }

        setLoading(false)
      })
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, params.email, params.password)
      const firebaseUser = userCredential.user

      // Fetch additional user data from Firestore
      const docRef = doc(db, 'users', firebaseUser.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // Merge Firestore data into firebaseUser
        const user = { ...firebaseUser, ...docSnap.data() }

        setUser(user)
      } else {
        console.log('No such document!')
      }

      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/home'
      router.replace(redirectURL)
    } catch (error) {
      if (errorCallback) errorCallback(error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      window.localStorage.removeItem('userData')
      window.localStorage.removeItem(authConfig.storageTokenKeyName)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const handleRegister = async (params, errorCallback) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password)
      const user = userCredential.user

      // Determine role based on email domain
      const role = params.email.endsWith('@launchbox.ai') ? 'Employee' : 'Client'

      await setDoc(doc(db, 'users', user.uid), {
        username: params.username,
        fullname: params.fullname,
        role: role,
        onBoarding: false,
        email: params.email
      })

      setUser(user)
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/home'
      router.replace(redirectURL)
    } catch (error) {
      if (errorCallback) errorCallback(error)
    }
  }

  const handlePasswordReset = async (params, errorCallback) => {
    try {
      const userCredential = await sendPasswordResetEmail(auth, params.email)
      setUser(null)
      const returnUrl = router.query.returnUrl
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/login'
      router.replace(redirectURL)
    } catch (error) {
      if (errorCallback) errorCallback(error)
    }
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    passwordReset: handlePasswordReset
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
