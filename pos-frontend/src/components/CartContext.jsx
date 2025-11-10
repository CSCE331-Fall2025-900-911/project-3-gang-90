import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function addItem(item) {
    setItems(prev => [...prev, item])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function editItem(index, newItem) {
    setItems(prev => prev.map((item, i) => (i === index ? newItem : item)))
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, editItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
