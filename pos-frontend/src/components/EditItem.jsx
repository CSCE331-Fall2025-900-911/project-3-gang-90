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
  const [mods, setMods] = useState('')

  const [item, setItem] = useState(null)

  const toTitle = (str = "") =>
    str
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(server + '/menu')
        const body = await res.json()
        const data = body.data

        const found = data.find(i=>String(i.item_id) === String(id))

        // const found = Array.isArray(data)
        //   ? data.find(i => String(i.item_id) === String(id))
        //   : null

        
        if (found) {
          setItem({
            ...found,
            item_name: toTitle(found.item_name)
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchItem()
  }, [id])

  if (!item) {
    return (
      <>
      <div className="main-page">
        <div className="top-bar">
          <h1>Loading...</h1>
          <div className="time">5:00 PM</div>
        </div>
      </div>
      <div>
        Couldnt find anything
      </div>
      </>
    )
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
            <h1>{item.item_name}</h1>
            <div>Price: ${Number(item.price).toFixed(2)}</div>
          </div>
        </div>

        <div className="customize-panel">
          <DrinkCustomization />
          <br />

          <div className="item-navigation-options">
            <button className="navigation-option" onClick={() => navigate(-1)}>
              <b>Cancel</b>
            </button>

            <button
              className="navigation-option"
              onClick={() => {
                addItem({
                  id: item.item_id,
                  name: item.item_name,
                  mods,
                  quantity,
                  price: Number(item.price)
                })
                navigate('/cart')
              }}
            >
              <b>Add To Order</b>
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
      </div>
    </div>
  )
}
