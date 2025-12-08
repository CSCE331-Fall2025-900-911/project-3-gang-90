import { GoogleLogin } from "@react-oauth/google";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'


export default function LoginButton() {
  const navigate = useNavigate()
  const { user, signInWithIdToken } = useAuth()


  return (
    // <div style={{ maxWidth: 420, margin: '2rem auto', padding: '1.25rem', border: '1px solid #ddd', borderRadius: 12 }}>
    <div className="border-black rounded-sm">
      {!user && (
        <>
          <GoogleLogin
            onSuccess={async response => {
              // console.log('Google response (full):', response)
              const id_token = response?.credential || null
              if (!id_token) { console.error('No id_token in response'); return }
              // Persist via AuthContext
              await signInWithIdToken(id_token)
              navigate("/milkyseries")
            }}
            // onError={() => console.log('Google login failed')}
          />
        </>
      )}
      {/* {user && (
        <div style={{ textAlign: 'center' }}>
          <img src={user.picture} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem' }} />
          <h3 style={{ margin: '0 0 0.25rem' }}>{user.name}</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>{user.email}</p>
          <button onClick={signOut} style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', border: 'none', background: '#4285F4', color: '#fff', borderRadius: 6, cursor: 'pointer' }}>Sign Out</button>
        </div>
      )} */}
    </div>
  )
}