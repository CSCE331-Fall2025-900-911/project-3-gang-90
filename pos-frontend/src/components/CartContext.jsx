import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [itemIds, setItemIds] = useState([])

  function addItem(item) {
    setItems(prev => [...prev, item])
    if (item.id) setItemIds(prev => [...prev, item.id])
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index))
    setItemIds(prev => prev.filter((_, i) => i !== index))
  }

  function editItem(index, newItem) {
    setItems(prev => prev.map((item, i) => (i === index ? newItem : item)))
    if (newItem.id)
      setItemIds(prev => prev.map((id, i) => (i === index ? newItem.id : id)))
  }

  function clearCart() {
    setItems([])
    setItemIds([])
  }

  return (
    <CartContext.Provider value={{ items, itemIds, addItem, removeItem, editItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}