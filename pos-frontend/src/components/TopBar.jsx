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

  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit'
        })
      );
    }, 1000 * 10);

  return () => clearInterval(interval);
}, []);

  return (
    <header className="top-bar">
      <div className="topbar-section left">
        <span className="topbar-time">{time}</span>
      </div>

      <div className="topbar-section center">
        <h1 className="topbar-title">ShareTea</h1>
      </div>

      <div className="topbar-section right">
        <div className="weather-wrapper">
          <WeatherBar />
        </div>

        {user && (
          <div className="relative">
            <img
              className="topbar-avatar"
              src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff&size=64`}
              alt={user?.name || "Profile Picture"}
              width={34}
              height={34}
              loading="lazy"
              onClick={() => setMenuOpen(v => !v)}
            />

            {menuOpen && (
              <div className="topbar-menu">
                <div className="topbar-menu-header">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm">{user.email}</div>
                </div>
                <button
                  className="topbar-menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut('Signed out by user');
                    navigate("/kiosk");
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar