import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import LoginTest from './LoginButton'
import { useState, useEffect } from 'react'
import LoginButton from './LoginButton'

export default function Home() {
  const { items: cartItems } = useCart()
  const [askLogin, setAskLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    const user = localStorage.getItem("auth.id_token")
    if (user) {
      setIsLoggedIn(true)
    }
  })

  function handleLoginLogic() {
    if (!isLoggedIn) {
      setAskLogin(true)
    } 
    navigate("/drinks")
  }

  return (
    <main>
      <div className="regular-container">
        <div className="top-bar">
          <h1>Menu</h1>
          <div className="time">5:00 PM</div>
        </div>
        <h1 className="main-menu-header">Select a Menu Category:</h1>
        <div className="menu-options">
          <Link className="menu-option" to="/milktea"><b>Milk Tea</b></Link>
          <Link className="menu-option" to="/fruittea"><b>Fruit Tea</b></Link>
          <Link className="menu-option" to="/specialty"><b>Specialty</b></Link>
        {askLogin ? 
        <div className='flex flex-col justify-center items-center'>
          <h1 className='main-menu-header'>Do you want to Sign in?</h1>
          <div className='flex flex-col justify-center items-center gap-5'>
            <LoginButton/>
            <div className='w-full flex flex-row justify-center items-center gap-5'>
              <Link className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' to="/drinks">Skip Login</Link>
              <button className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' onClick={()=>setAskLogin(false)} >Go Back</button>
            </div>
          </div>
        </div>
        :
        <div>
          <h1 className="main-menu-header">Select a Menu Category:</h1>
          <div className="menu-options">
            {/* <Link className="menu-option" to="/drinks"><b>Drinks</b></Link> */}
            <button className="menu-option font-bold" onClick={handleLoginLogic}>Drinks</button>
            <Link className="menu-option" to="/entrees"><b>Entrees</b></Link>
            <Link className="menu-option" to="/sides"><b>Sides</b></Link>
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
      </div>
    </main>
  )
}