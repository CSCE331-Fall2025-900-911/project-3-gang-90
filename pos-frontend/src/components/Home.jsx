import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'

export default function Home() {
  const { items: cartItems } = useCart()
  return (
    <div className="regular-container">
      <div className="top-bar">
        <h1>Menu</h1>
        <div className="time">5:00 PM</div>
      </div>
      <h1 className="main-menu-header">Select a Menu Category:</h1>
      <div className="menu-options">
        <Link className="menu-option" to="/drinks"><b>Drinks</b></Link>
        <Link className="menu-option" to="/entrees"><b>Entrees</b></Link>
        <Link className="menu-option" to="/sides"><b>Sides</b></Link>
      </div>
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
  )
}