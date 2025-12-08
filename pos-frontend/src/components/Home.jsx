import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import LoginButton from './LoginButton'
import TopBar from './TopBar'
import { useAuth } from './AuthContext'

export default function Home() {
  const { items: cartItems } = useCart()
  const [askLogin, setAskLogin] = useState(false)
  const navigate = useNavigate()
  const [milk, setMilk] = useState(false)
  const [fruit, setFruit] = useState(false)
  const [special, setSpecial] = useState(false)
  const { user, authReady, logoutReason, clearLogoutReason } = useAuth()



  function handleLoginLogic(button) {
    if (button == 'milk') setMilk(true)
    if (button == 'fruit') setFruit(true)
    if (button == 'special') setSpecial(true)

    if (!user) {
      setAskLogin(true)
      return
    } 
    if (milk) navigate('/milktea')
    if (fruit) navigate('/fruittea')
    if (special) navigate('/specialty')
  }

  function handleSkip() {
    if (milk) navigate('/milktea')
    if (fruit) navigate('/fruittea')
    if (special) navigate('/specialty')
  }

  useEffect(() => {
    if (authReady && user) {
      navigate('/milktea')
    }
  }, [authReady, user, navigate])

  return (
    <main>
      <div className="regular-contzainer">
      <TopBar/>
      {logoutReason && (
        <div className='w-full flex justify-center items-center'>
          <div className='bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4 shadow-sm border border-yellow-300 flex items-center gap-3'>
            <span>⚠️ {logoutReason}</span>
            <button className='text-yellow-900 underline cursor-pointer' onClick={clearLogoutReason}>Dismiss</button>
          </div>
        </div>
      )}
      {askLogin ? 
      <div className='flex flex-col justify-center items-center'>
        <h1 className='main-menu-header'>Do you want to Sign in?</h1>
        <div className='flex flex-col justify-center items-center gap-5'>
          <LoginButton/>
          <div className='w-full flex flex-row justify-center items-center gap-5'>
            <button className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' onClick={handleSkip}>Skip Login</button>
            <button className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' onClick={()=>setAskLogin(false)} >Go Back</button>
          </div>
        </div>
      </div>
      :
      <div>
        <h1 className="main-menu-header">Select a Menu Category:</h1>
        <div className="menu-options">
          {/* <Link className="menu-option" to="/drinks"><b>Drinks</b></Link> */}
          {/* <Link className="menu-option" to="/fruittea"><b>Fruit Tea</b></Link>
          <Link className="menu-option" to="/specialty"><b>Specialty</b></Link> */}
          <button className="menu-option font-bold" onClick={()=>handleLoginLogic('milk')}>Milk Tea</button>
          <button className="menu-option font-bold" onClick={()=>handleLoginLogic('fruit')}>Fruit Tea</button>
          <button className="menu-option font-bold" onClick={()=>handleLoginLogic('special')}>Specialty</button>
        </div>
      </div>
      }
      <Link className="floating-btn settings-btn" to="/settings" title="Settings" alt="Settings">⚙️</Link>
      <Link className="floating-btn cart-btn" to="/cart" title="Cart" style={{position:'fixed', right:'32px', bottom:'32px'}} alt="Cart">
        🛒
        {cartItems.length > 0 && (
          <span style={{
            position:'absolute',
            top:'0px',
            right:'0px',
            background:'#f5f5f5',
            color:'#3a3a3a',
            borderRadius:'50%',
            minWidth:'28px',
            height:'28px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'1.1rem',
            fontWeight:'bold',
            zIndex:202
          }}>{cartItems.length}</span>
        )}
      </Link>
      </div>
    </main>
  )
}