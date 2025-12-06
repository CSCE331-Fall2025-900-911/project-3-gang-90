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

import CashierMenu from './Project2/CashierMenu'
import EmployeeList from './Project2/EmployeeList'
import ManagerProducts from "./Project2/ManagerProducts"
import SalesReport from './components/MangerComponets/SalesReport'
import ZReport from './Project2/ZReport'
import XReport from './Project2/XReport'
import UsageReport from './components/MangerComponets/UsageReport'
import { useEffect } from 'react'

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
            <Route path="/reportx" element={<XReport />} />
            <Route path="/reportz" element ={<ZReport/>} />
            <Route path="/products" element={<ManagerProducts />} />
            <Route path="/salesReport" element={<SalesReport/>}/>
            <Route path="/cashier" element={<CashierMenu />} />
            <Route path="/usageReport" element={<UsageReport/>}/>
            <Route path="/employees" element={<EmployeeList />} />
          </Routes>
        </div>
      </CartProvider>
    </AccessibilityProvider>
  )
}
