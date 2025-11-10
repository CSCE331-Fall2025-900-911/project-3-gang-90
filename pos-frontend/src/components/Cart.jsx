import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')

  function handleCheckout() {
    setShowModal(true)
  }

  function handleNameSubmit(e) {
    e.preventDefault()
    setShowModal(false)
    clearCart()
    setName('')
    navigate('/')
  }

  return (
    <div className="regular-container" style={{position:'relative'}}>
      <div className="top-bar">
        <h1>Your Cart</h1>
        <div className="time">5:00 PM</div>
      </div>
      <div style={{padding:20, display:'flex', flexDirection:'column', minHeight:'60vh', justifyContent:'space-between'}}>
        <div>
          {items.length === 0 ? (
            <>
              <p>No items yet.</p>
            </>
          ) : (
            <>
              {items.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  <div className="cart-item-details">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-mods">{item.mods}</p>
                    <p className="cart-item-qty">Quantity: {item.quantity}</p>
                    <p className="cart-item-price">Price: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <a className="cart-item-action" onClick={() => removeItem(idx)} style={{cursor:'pointer'}}>Remove</a>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
          <button className="bottom-button" style={{flex:1}} onClick={handleCheckout}>Checkout</button>
          <Link className="bottom-button" style={{flex:1, textAlign:'center', lineHeight:'38px'}} to="/">Back to Menu</Link>
        </div>
      </div>

      {showModal && (
        <>
          <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:200}}></div>
          <div style={{position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'#d3d3d3', padding:'40px 30px', borderRadius:'18px', boxShadow:'0 2px 16px rgba(0,0,0,0.2)', zIndex:201, minWidth:'320px', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h2 style={{color:'#3a3a3a', marginBottom:'18px'}}>Enter your name</h2>
            <form onSubmit={handleNameSubmit} style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                style={{padding:'12px', fontSize:'1.2rem', borderRadius:'8px', border:'1px solid #929292', marginBottom:'18px', width:'100%'}}
                required
                autoFocus
              />
              <button type="submit" className="bottom-button" style={{width:'100%'}}>Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
