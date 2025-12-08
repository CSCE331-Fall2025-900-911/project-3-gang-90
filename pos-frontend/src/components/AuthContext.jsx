import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const VITE_SERVER = import.meta.env.VITE_SERVER || 'http://localhost:3000'

const AuthContext = createContext({ user: null, authReady: false, signInWithIdToken: () => {}, signOut: () => {}, logoutReason: null, clearLogoutReason: () => {} })

const decodeJwt = (jwt) => {
  try {
    const base64Url = jwt.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

const getInitialUser = () => {
  const token = localStorage.getItem('auth.id_token')
  if (!token) return null
  const payload = decodeJwt(token)
  const now = Math.floor(Date.now() / 1000)
  if (!payload || (payload.exp && payload.exp < now)) return null
  return { name: payload.name, email: payload.email, picture: payload.picture, raw: payload }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser())
  const [authReady, setAuthReady] = useState(Boolean(user))
  const idleTimeoutMs = 15 * 60 * 1000 // 15 minutes
  const idleTimerRef = useRef(null)
  const lastActivityRef = useRef(Date.now())
  const [logoutReason, setLogoutReason] = useState(null)

  useEffect(() => {
    // verify token with backend if present
    const token = localStorage.getItem('auth.id_token')
    if (!token) { setAuthReady(true); return }
    const server = VITE_SERVER + "/auth/google/me"
    ;(async () => {
      try {
        const res = await fetch(server, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          localStorage.removeItem('auth.id_token')
          setUser(null)
          setAuthReady(true)
          return
        }
        const data = await res.json()
        if (data && data.user) {
          setUser({
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture,
            raw: data.user
          })
        }
      } catch {
      } finally {
        setAuthReady(true)
      }
    })()
  }, [])

  useEffect(() => {
    function markActivity() {
      lastActivityRef.current = Date.now()
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
      scheduleIdleCheck()
    }

    function scheduleIdleCheck() {
      const token = localStorage.getItem('auth.id_token')
      if (!token) return
      const payload = decodeJwt(token)
      const now = Date.now()
      const expMs = payload?.exp ? payload.exp * 1000 : null
      const idleDueIn = idleTimeoutMs - (now - lastActivityRef.current)
      const expDueIn = expMs ? Math.max(expMs - now, 0) : Number.POSITIVE_INFINITY
      const nextIn = Math.max(0, Math.min(idleDueIn, expDueIn))

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        const currentNow = Date.now()
        const inactiveLong = currentNow - lastActivityRef.current >= idleTimeoutMs
        const expired = expMs ? currentNow >= expMs : false
        if (inactiveLong || expired) {
          signOut('Session ended due to inactivity or expiry')
        } else {
          scheduleIdleCheck()
        }
      }, nextIn)
    }

    const events = ['click', 'keydown', 'mousemove', 'touchstart']
    events.forEach(ev => window.addEventListener(ev, markActivity, { passive: true }))
    if (localStorage.getItem('auth.id_token')) scheduleIdleCheck()

    return () => {
      events.forEach(ev => window.removeEventListener(ev, markActivity))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  const signInWithIdToken = async (idToken) => {
    localStorage.setItem('auth.id_token', idToken)
    const payload = decodeJwt(idToken)
    if (payload) {
      setUser({ name: payload.name, email: payload.email, picture: payload.picture, raw: payload })
    }
    setLogoutReason(null)
    try {
      const res = await fetch(VITE_SERVER + '/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      })
      // ignore response for now
      await res.json().catch(() => {})
    } catch {}
  }

  const signOut = (reason) => {
    localStorage.removeItem('auth.id_token')
    setUser(null)
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
    if (reason) setLogoutReason(typeof reason === 'string' ? reason : 'You have been logged out.')
  }

  const clearLogoutReason = () => setLogoutReason(null)

  const value = useMemo(() => ({ user, authReady, signInWithIdToken, signOut, logoutReason, clearLogoutReason }), [user, authReady, logoutReason])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
