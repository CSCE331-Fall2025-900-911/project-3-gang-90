import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import WeatherBar from './WeatherBar'

const VITE_SERVER = import.meta.env.VITE_SERVER || 'http://localhost:3000'

const TopBar = () => {
  const { user: authUser, authReady, signOut } = useAuth()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authReady) return
    setUser(authUser || null)
  }, [authReady, authUser])

  const avatar = useMemo(() => {
    const src = user?.picture
    return src || null
  }, [user])

  return (
    <div className="top-bar">
<<<<<<< HEAD
        <h1>Drinks</h1>
=======
        <h2 className="text-3xl font-bold">ShareTea</h2>
>>>>>>> sprint-3
        <div className='flex flex-row gap-2 justify-center items-center relative'>
          <div className="time">
            <WeatherBar/>
          </div>
          {user ? (
            <>
              <img
                className='rounded-lg cursor-pointer'
                src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff&size=64`}
                alt={user?.name || "Profile Picture"}
                width={30}
                height={30}
                loading='lazy'
                referrerPolicy='no-referrer'
                crossOrigin='anonymous'
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff&size=64`
                }}
                onClick={() => setMenuOpen(v => !v)}
              />
              {menuOpen && (
                <div className='absolute right-0 top-10 bg-white text-[#222] rounded-md shadow-lg border border-[#ddd] min-w-[180px] z-50'>
                  <div className='px-3 py-2 border-b border-[#eee]'>
                    <div className='font-semibold'>{user.name}</div>
                    <div className='text-sm text-[#666]'>{user.email}</div>
                  </div>
                  <button
                    className='w-full text-left px-3 py-2 hover:bg-[#f7f7f7] cursor-pointer'
                    onClick={() => { setMenuOpen(false); signOut('Signed out by user'); navigate("/kiosk") }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
    </div>
  )
}

export default TopBar