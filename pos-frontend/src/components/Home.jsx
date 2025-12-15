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


  const [freshBrew, setFreshBrew] = useState(false)
  const [milkySeries, setMilkySeries] = useState(false)
  const [fruity, setFruity] = useState(false)
  const [nonCafeinated, setNonCafeinated] = useState(false)
  const [iceBlended, setIceBlended] = useState(false)
  const [matcha, setMatcha] = useState(false)



  function resetSelections() {
    setFreshBrew(false)
    setMilkySeries(false)
    setFruity(false)
    setNonCafeinated(false)
    setIceBlended(false)
    setMatcha(false)
  }

  function handleLoginLogic(button) {
    resetSelections()

    if (button === 'freshBrew') setFreshBrew(true)
    if (button === 'milkySeries') setMilkySeries(true)
    if (button === 'fruity') setFruity(true)
    if (button === 'nonCaffeinated') setNonCafeinated(true)
    if (button === 'iceBlended') setIceBlended(true)
    if (button === 'matcha') setMatcha(true)

    if (!user) {
      setAskLogin(true)
      return
    }

    if (freshBrew) navigate('/freshbrew')
    if (milkySeries) navigate('/milkyseries')
    if (fruity) navigate('/fruity')
    if (nonCafeinated) navigate('/noncaffeinated')
    if (iceBlended) navigate('/iceblended')
    if (matcha) navigate('/matcha')
  }

  function handleSkip() {
    if (freshBrew) navigate('/freshbrew')
    if (milkySeries) navigate('/milkyseries')
    if (fruity) navigate('/fruity')
    if (nonCafeinated) navigate('/noncaffeinated')
    if (iceBlended) navigate('/iceblended')
    if (matcha) navigate('/matcha')
  }

  useEffect(() => {
  }, [authReady, user, navigate])

  return (
    <main>
      <div className="regular-container">
        <TopBar/>

        {logoutReason && (
          <div className='w-full flex justify-center items-center'>
            <div className='bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4 shadow-sm border border-yellow-300 flex items-center gap-3'>
              <span>{logoutReason}</span>
              <button className='text-yellow-900 underline cursor-pointer' onClick={clearLogoutReason}>Dismiss</button>
            </div>
          </div>
        )}

        {askLogin ? (
          <div className='flex flex-col justify-center items-center'>
            <h1 className='main-menu-header'>Do you want to Sign in?</h1>
            <div className='flex flex-col justify-center items-center gap-5'>
              <LoginButton/>
              <div className='w-full flex flex-row justify-center items-center gap-5'>
                <button className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' onClick={handleSkip}>Skip Login</button>
                <button className='bg-[#929292] text-[#fff] px-10 py-2 rounded-md cursor-pointer' onClick={() => setAskLogin(false)}>Go Back</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="main-menu-header">Select a Menu Category:</h1>
            <div className="menu-options">

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('freshBrew')}>
                Fresh Brew
              </button>

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('milkySeries')}>
                Milky Series
              </button>

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('fruity')}>
                Fruity Beverage
              </button>

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('noncaffeinated')}>
                Non-Caffeinated
              </button>

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('iceblended')}>
                Ice Blended
              </button>

              <button className="menu-option font-bold" onClick={() => handleLoginLogic('matcha')}>
                Matcha Series
              </button>

            </div>
          </div>
        )}

        <Link className="floating-btn settings-btn" to="/settings" title="Settings">⚙️</Link>

        <Link className="floating-btn cart-btn" to="/cart" title="Cart" style={{ position:'fixed', right:'32px', bottom:'32px' }}>
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
            }}>
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </main>
  )
}