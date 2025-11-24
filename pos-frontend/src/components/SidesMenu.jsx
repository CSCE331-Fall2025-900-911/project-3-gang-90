import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'

export default function SidesMenu(){
  const items = [{id:'s1', name:'Side 1'}, {id:'s2', name:'Side 2'}]
  const { items: cartItems } = useCart()
  return (
    <>
      <div className="top-bar">
        <h1>Sides</h1>
        <div className="time">5:00 PM</div>
      </div>

      <div className="panel-container">
        <div className="sidebar">
          <div>
            <Link className="menu-item" to="/drinks">Drinks</Link><br /><br />
            <Link className="menu-item" to="/entrees">Entrees</Link><br /><br />
            <Link className="menu-item selected" to="/sides">Sides</Link>
          </div>
        </div>

        <div className="item-menu">
          {items.map(i => (
            <Link key={i.id} className="menu-item" to={`/edit/${i.name}`}>
              <div className="item-button">{i.name}</div>
            </Link>
          ))}
        </div>
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
    </>
  )
}