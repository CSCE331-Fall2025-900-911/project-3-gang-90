import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";


export default function LoginButton() {
  const VITE_SERVER = import.meta.env.VITE_SERVER || 'http://localhost:3000'
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loadingRestore, setLoadingRestore] = useState(true)

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

  useEffect(() => {
    const stored = localStorage.getItem('auth.id_token')
    if (!stored) { setLoadingRestore(false); return }
    const payload = decodeJwt(stored)
    if (!payload) { localStorage.removeItem('auth.id_token'); setLoadingRestore(false); return }
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) { // expired
      localStorage.removeItem('auth.id_token'); setLoadingRestore(false); return }
    setUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      raw: payload
    })
    setLoadingRestore(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem('auth.id_token')
    setUser(null)
  }
  // const handleLogin = useGoogleLogin({
  //   onSuccess: async tokenResponse => {
  //     console.log(tokenResponse)

  //     const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  //       headers: {Authorization: `Bearer ${tokenResponse.access_token}`}
  //     })
      
  //     const res = await res.json()

  //     console.log(userInfo)
  //   }
  // })

  return (
    // <div style={{ maxWidth: 420, margin: '2rem auto', padding: '1.25rem', border: '1px solid #ddd', borderRadius: 12 }}>
    <div className="border-black rounded-sm">
      {!user && (
        <>
          <GoogleLogin
            onSuccess={async response => {
              console.log('Google response (full):', response)
              const id_token = response?.credential || null
              if (!id_token) { console.error('No id_token in response'); return }
              //persist token
              localStorage.setItem('auth.id_token', id_token)
              navigate("/drinks")
              const payload = decodeJwt(id_token)
              if (payload) {
                setUser({ name: payload.name, email: payload.email, picture: payload.picture, raw: payload })
              }
              try {
                const serverUrl = VITE_SERVER + '/auth/google'
                const r = await fetch(serverUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id_token })
                })
                const data = await r.json()
                console.log('backend response (id_token)', data)
              } catch (e) {
                console.error('Server verification failed (continuing with local token):', e)
              }
            }}
            onError={() => console.log('Google login failed')}
          />
          {loadingRestore && <p style={{ fontSize: '0.85rem', color: '#666' }}>Restoring session...</p>}
        </>
      )}
      {user && (
        <div style={{ textAlign: 'center' }}>
          <img src={user.picture} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />
          <h3 style={{ margin: '0 0 0.25rem' }}>{user.name}</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>{user.email}</p>
          <button onClick={signOut} style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', border: 'none', background: '#4285F4', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Sign Out</button>
        </div>
      )}
    </div>
  )
}