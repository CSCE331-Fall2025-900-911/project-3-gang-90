import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useNavigate, Link } from 'react-router-dom'

let server = import.meta.env.VITE_SERVER;

export default function Cart() {
  const { items, itemIds, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const tax = subtotal * 0.0825
  const total = subtotal + tax

  function handleCheckout() {
    setShowModal(true)
  }

  async function submitTransaction(customerName) {
    const transaction = {
      customerName,
      transactionTime: new Date().toISOString(),
      employeeId: 1,
      totalPrice: Number(total.toFixed(2)),
    };
    console.log("Transaction to submit:", transaction);

    const item = itemIds.map((id) => ({ itemId: id }));
    console.log("Items to submit:", item);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("Fetch timed out");
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(server + "/menu/TransactionAndDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({ transaction, item }),
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error("Error:", response.status);
        return;
      }
    } 
    catch (err) {
      clearTimeout(timeout);
      console.error("Error:", err);
    }
  }


  async function handleNameSubmit(e) {
    e.preventDefault()
    setShowModal(false)

    await submitTransaction(name)

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
                    <p className="cart-item-price">
                      Price: {
                        typeof item.price === 'number'
                          ? `$${item.price.toFixed(2)}`
                          : `$${Number(item.price || 0).toFixed(2)}`
                      }
                    </p>
                  </div>
                  <div className="cart-item-actions">
                    <a className="cart-item-action" onClick={() => removeItem(idx)} style={{cursor:'pointer'}}>Remove</a>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{
          background:'#f5f5f5',
          borderRadius:'12px',
          padding:'18px 24px',
          alignSelf:'center',
          fontSize:'1.15rem',
        }}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
            <span>Subtotal: ${subtotal.toFixed(2)}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold'}}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
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
