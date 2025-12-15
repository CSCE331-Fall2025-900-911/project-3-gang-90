import React, { useState } from 'react'
import { useCart } from './CartContext'
import { useNavigate, Link } from 'react-router-dom'
import { useRecommendation } from './RecommendationContext'

let server = import.meta.env.VITE_SERVER;

export default function Cart() {
  const { items, itemIds, removeItem, clearCart, incrementQuantity, decrementQuantity } = useCart()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const { suggestions, visible, hideRecommendations } = useRecommendation()

  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const tax = subtotal * 0.0825
  const total = subtotal + tax

  function handleCheckout() {
    setShowModal(true)
  }

  async function decrementIngredients(orderItems)
  {
    for (const item of orderItems) 
    {
      if (!item?.id) continue;
      const qty = 1;

      const ingRes = await fetch(`${server}/api/menu/${item.id}/ingredients?seasonal=false`);
      if (!ingRes.ok) continue;

      const ingredients = await ingRes.json();

      for (const ing of ingredients) 
      {
        const ingId = ing.id;
        if (!ingId) continue;

        await fetch(`${server}/api/ingredients/${ingId}/decrease`, 
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: qty }),
        });
      }
    }
  }

  async function submitTransaction(customerName) {
    const transactionTime = new Date().toISOString();
    console.log("ItemIDs: ", itemIds);
    const items = itemIds.map((id) => ({ id }));
    const body = {
      customerName,
      transactionTime,
      employeeId: 1,
      totalPrice: Number(total.toFixed(2)),
      items
    };
    console.log("Transaction to submit:", body);

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("Fetch timed out");
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(server + "/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify(body),
      });
      console.log("Items: ", items);
      decrementIngredients(items);
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
    navigate('/kiosk')
  }

  return (
    <div className="regular-container relative">
      <div className="top-bar">
        <h1>Your Cart</h1>
        <div className="time">5:00 PM</div>
      </div>
      <div className="p-5 flex flex-col min-h-[60vh] justify-between">
        {visible && suggestions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-4">
            <div className="flex justify-between items-center">
              <strong>Recommended for you</strong>
              <button onClick={hideRecommendations} className="border-none bg-transparent cursor-pointer">✕</button>
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              {suggestions.map(s => (
                <Link
                  key={String(s.item_id ?? s.id)}
                  to={`/edit/${String(s.item_id ?? s.id)}`}
                  className="menu-item px-3 py-2 rounded-lg bg-gray-100 border border-gray-200"
                >
                  {(s.item_name ?? s.name)}
                  <span className="ml-2 text-green-700">
                    {typeof s.price === 'number' ? `$${s.price.toFixed(2)}` : `$${Number(s.price||0).toFixed(2)}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
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
                    <p className="cart-item-mods"><b>Modifications:</b> {item.mods}</p>
                    <p className="cart-item-qty"><b>Quantity:</b> {item.quantity}</p>
                    <p className="cart-item-price">
                      <b>Price:</b> {
                        typeof item.price === 'number'
                          ? `$${item.price.toFixed(2)}`
                          : `$${Number(item.price || 0).toFixed(2)}`
                      }
                    </p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-actions flex items-center gap-3">
                      <button
                        className="quantity-btn"
                        onClick={() => decrementQuantity(idx)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <button
                        className="quantity-btn"
                        onClick={() => incrementQuantity(idx)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="bg-gray-100 rounded-xl px-6 py-4 self-center text-[1.15rem]">
          <div className="flex justify-between mb-2">
            <span>Subtotal: ${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button className="bottom-button flex-1" onClick={handleCheckout}>Checkout</button>
          <Link className="bottom-button flex-1 text-center leading-[38px]" to="/kiosk">Back to Menu</Link>
        </div>
      </div>
      {showModal && (
        <>
          <div className="fixed inset-0 w-screen h-screen bg-black/50 z-50"></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-300 px-7 py-10 rounded-2xl shadow-lg z-50 min-w-[320px] flex flex-col items-center">
            <h2 className="text-gray-800 mb-4 text-2xl">Enter your name</h2>
            <form onSubmit={handleNameSubmit} className="w-full flex flex-col items-center">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="p-3 text-xl rounded-lg border border-gray-400 mb-4 w-full"
                required
                autoFocus
              />
              <button type="submit" className="bottom-button w-full">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}