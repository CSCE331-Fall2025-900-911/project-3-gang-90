import React from 'react'
import { CartProvider } from './components/CartContext'
import { AccessibilityProvider } from './components/AccessibilityContext'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import DrinksMenu from './components/DrinksMenu'
import EntreesMenu from './components/EntreesMenu'
import SidesMenu from './components/SidesMenu'
import Cart from './components/Cart'
import EditItem from './components/EditItem'
import Settings from './components/Settings'

import ManagerProducts from "./Project2/ManagerProducts"
import SalesReport from './components/MangerComponets/SalesReport'
import ZReport from './Project2/ZReport'

export default function App() {
  return (
    <AccessibilityProvider>
      <CartProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drinks" element={<DrinksMenu />} />
            <Route path="/entrees" element={<EntreesMenu />} />
            <Route path="/sides" element={<SidesMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit/:id" element={<EditItem />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reportz" element ={<ZReport/>} />
            <Route path="/products" element={<ManagerProducts />} />
            <Route path="/salesReport" element={<SalesReport/>}/>
          </Routes>
        </div>
      </CartProvider>
    </AccessibilityProvider>
  )
}
