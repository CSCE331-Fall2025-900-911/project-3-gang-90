import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'
import TopBar from './TopBar';
let server = import.meta.env.VITE_SERVER;

export default function DrinksMenu() {
  const [items, setItems] = useState([])
  const { items: cartItems } = useCart()

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(server + '/api/menu/');
        const data = await res.json();

        const toTitle = (str = "") =>
          str
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());

        const items = Array.isArray(data)
          ? data
<<<<<<< HEAD
<<<<<<<< HEAD:pos-frontend/src/components/FruitTeaMenu.jsx
              .filter(i => i.stat && i.category === "Fruit Tea")
========
              .filter(i => i.stat && i.category === "Specialty")
>>>>>>>> sprint-3:pos-frontend/src/components/SpecialtyMenu.jsx
=======
              .filter(i => i.stat && i.category === "fresh brew")
>>>>>>> sprint-3
              .map(i => ({
                ...i,
                item_name: toTitle(i.name),
                item_id: i.id,
                price: Number(i.price)
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
    <main>
      <TopBar/>

      <div className="panel-container">
        <div className="sidebar">
          <div>
<<<<<<< HEAD
            <Link className="menu-item" to="/milktea">Milk Tea</Link><br /><br />
<<<<<<<< HEAD:pos-frontend/src/components/FruitTeaMenu.jsx
            <Link className="menu-item selected" to="/fruittea">Fruit Tea</Link><br /><br />
            <Link className="menu-item" to="/specialty">Specialty</Link>
========
            <Link className="menu-item" to="/fruittea">Fruit Tea</Link><br /><br />
            <Link className="menu-item selected" to="/specialty">Specialty</Link>
>>>>>>>> sprint-3:pos-frontend/src/components/SpecialtyMenu.jsx
=======
            <Link className="menu-item selected" to="/freshbrew">Fresh Brew</Link><br />
            <Link className="menu-item" to="/milkyseries">Milky Series</Link><br />
            <Link className="menu-item" to="/fruity">Fruity Beverage</Link><br />
            <Link className="menu-item" to="/noncaffeinated">Non-Caffeinated</Link><br />
            <Link className="menu-item" to="/iceblended">Ice Blended</Link><br />
            <Link className="menu-item" to="/matcha">Matcha Series</Link><br />
>>>>>>> sprint-3
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

      <Link className="floating-btn settings-btn" to="/settings" title="Settings">
          ⚙️
      </Link>

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
            }}
          >
            {cartItems.length}
          </span>
        )}
      </Link>
    </main>
  )
}