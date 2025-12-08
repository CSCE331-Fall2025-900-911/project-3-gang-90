import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from './CartContext'
import DrinkCustomization from './DrinkCustomization'

let server = import.meta.env.VITE_SERVER;

export default function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items: cartItems } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [mods, setMods] = useState([])

  const [item, setItem] = useState(null)

  const toTitle = (str = "") =>
    str
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(server + '/api/menu/')
        const data = await res.json()

        const found = Array.isArray(data)
          ? data.find(i => String(i.item_id ?? i.id) === String(id))
          : null;

        if (found) {
          setItem({
            ...found,
            item_name: toTitle(found.item_name ?? found.name ?? "")
          });
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchItem()
  }, [id])

  if (!item) {
    return (
      <div className="main-page">
        <div className="top-bar">
          <h1>Loading...</h1>
          <div className="time">5:00 PM</div>
        </div>
      </div>
    )
  }

  // Helper to get price adjustment from mods
  function getAdjustedPrice(basePrice, modsArr) {
    let price = Number(basePrice);
    const sizeMod = modsArr.find(m => m.startsWith('Size:'));
    if (sizeMod) {
      if (sizeMod.includes('Medium')) price += 0.5;
      if (sizeMod.includes('Large')) price += 1.0;
    }
    return price;
  }

  // Helper to get mods string
  function getModsString(modsArr) {
    return modsArr.map(m => m.split(':')[1] || m).join(', ');
  }

  return (
    <div className="main-page">
      <div className="top-bar">
        <h1>Edit Item</h1>
        <div className="time">5:00 PM</div>
      </div>

      <div className="panel-container">
        <div className="item-sidebar">
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>{item.item_name}</h1>
            <div style={{ fontSize: '1.3rem', fontWeight: 500, marginBottom: 12 }}>
              Price: ${getAdjustedPrice(item.price, mods).toFixed(2)}
            </div>
            <div style={{ fontSize: '1.1rem', color: '#555', marginBottom: 8 }}>
              Modifications: {getModsString(mods)}
            </div>
          </div>
        </div>

        <div className="customize-panel" style={{ fontSize: '1.1rem' }}>
          <DrinkCustomization mods={mods} setMods={setMods} />
          <br />

          <div className="item-navigation-options" style={{ marginTop: 16 }}>
            <button className="navigation-option" style={{ fontSize: '1.1rem', fontWeight: 500 }} onClick={() => navigate(-1)} alt="Cancel and go back">
              Cancel
            </button>

            <button
              className="navigation-option"
              style={{ fontSize: '1.1rem', fontWeight: 700, border: 'none' }}
              onClick={() => {
                addItem({
                  id: item.item_id,
                  name: item.item_name,
                  mods: getModsString(mods),
                  quantity,
                  price: getAdjustedPrice(item.price, mods)
                })
                navigate('/cart')
              }}
              alt={`Add ${item.item_name} to order`}
            >
              Add To Order
            </button>
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
      </div>
    </div>
  )
}