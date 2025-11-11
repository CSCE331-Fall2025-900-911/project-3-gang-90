import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
let server = import.meta.env.VITE_SERVER;

export default function DrinksMenu() {
  const [items, setItems] = useState([])
  const { items: cartItems } = useCart()

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(server + '/menu');
        const data = await res.json();

        const toTitle = (str = "") =>
          str
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());

        const items = Array.isArray(data)
          ? data
              .filter(i => i.is_active)
              .map(i => ({
                ...i,
                item_name: toTitle(i.item_name),
                item_id: i.item_id
              }))
          : [];

        setItems(items);

      } catch (err) {
        setItems([]);
      }
    }
    fetchMenu();
  }, []);

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
            <Link
              key={i.item_id}
              className="menu-item"
              to={`/edit/${i.item_id}`}
            >
              <div className="item-button">
                {i.item_name}
                <span
                  style={{
                    float:'right',
                    fontWeight:'normal',
                    fontSize:'0.95em',
                    color:'#2a7b2a',
                    marginLeft:'12px'
                  }}
                >
                  {typeof i.price === 'number'
                    ? `$${i.price.toFixed(2)}`
                    : `$${Number(i.price || 0).toFixed(2)}`
                  }
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link className="floating-btn settings-btn" to="/settings" title="Settings">⚙️</Link>

      <Link
        className="floating-btn cart-btn"
        to="/cart"
        title="Cart"
        style={{position:'fixed', right:'32px', bottom:'32px'}}
      >
        🛒
        {cartItems.length > 0 && (
          <span
            style={{
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
            }}
          >
            {cartItems.length}
          </span>
        )}
      </Link>
    </>
  )
}
