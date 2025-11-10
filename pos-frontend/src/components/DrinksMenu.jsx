import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'

export default function DrinksMenu(){
  const items = [{id:'d1', name:'Drink 1'}, {id:'d2', name:'Drink 2'}]
  const { items: cartItems } = useCart()
  return (
      <>
        <div className="top-bar">
          <h1>Drinks</h1>
          <div className="time">5:00 PM</div>
        </div>
  
        <div className="panel-container">
          <div className="sidebar">
            <div>
              <Link className="menu-item selected" to="/drinks">Drinks</Link><br /><br />
              <Link className="menu-item" to="/entrees">Entrees</Link><br /><br />
              <Link className="menu-item" to="/sides">Sides</Link>
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
      </>
    )
}
