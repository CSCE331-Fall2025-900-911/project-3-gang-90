import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from './CartContext'
import DrinkCustomization from './DrinkCustomization'

export default function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items: cartItems } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [mods, setMods] = useState('')
  const price = 4.99

  return (
    <div className="main-page">
      <div className="top-bar">
        <h1>Edit Item</h1>
        <div className="time">5:00 PM</div>
      </div>
      <div className="panel-container">
        <div className="item-sidebar">
          <div>
            <h1>{id}</h1>
            <div>Price: $X.XX</div>
          </div>
        </div>

        <div className="customize-panel">
          <DrinkCustomization />
          <br />
          <div className="item-navigation-options">
            <button className="navigation-option" onClick={() => navigate(-1)}><b>Cancel</b></button>
            <button
              className="navigation-option"
              onClick={() => {
                addItem({
                  name: id,
                  mods,
                  quantity,
                  price
                })
                navigate('/cart')
              }}
            >
              <b>Add To Order</b>
            </button>
          </div>
        </div>

        <Link className="floating-btn settings-btn" to="/settings" title="Settings">⚙️</Link>
        <Link className="floating-btn cart-btn" to="/cart" title="Cart" style={{position:'fixed', right:'32px', bottom:'32px'}}>
          🛒
          {cartItems.length > 0 && (
            <span style={{
              position:'absolute',
              top:'-10px',
              right:'-10px',
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
  )
}
