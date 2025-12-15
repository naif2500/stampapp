'use client'

import { useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'

export default function AuthBootstrap({ children }) {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth)
      }
    })
    return () => unsub()
  }, [])

  return children
}
