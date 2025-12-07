import { useMemo, useState } from 'react'


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

const getUser = () => {
  const token = localStorage.getItem("auth.id_token")
  if (!token) return null
  const payload = decodeJwt(token)
  const now = Math.floor(Date.now()/1000)
  if (!payload || (payload.exp && payload.exp < now)) return null;
  return {name: payload.name, email: payload.email, picture: payload.picture, raw: payload}
}

const TopBar = () => {
  const [user] = useState(getUser())

  const avatar = useMemo(() => {
    const src = user?.picture;
    return src
  }, [user])

  return (
    <div className="top-bar">
        <h1>Drinks</h1>
        <div className='flex flex-row gap-2 justify-center items-center'>
          <div className="time">5:00 PM</div>
          <img
          className='rounded-lg'
          src={avatar}
          alt={user?.name || "Profile Picture"}
          width={30}
          height={30}
          onError={(e) => {e.currentTarget.src = "/"}}
          />
        </div>
    </div>
  )
}

export default TopBar