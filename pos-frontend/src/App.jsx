import React from 'react'
import { CartProvider } from './components/CartContext'
import { AccessibilityProvider } from './components/AccessibilityContext'
import { Routes, Route, Link } from 'react-router-dom'
import SystemSelect from "./components/SystemSelect";
import Home from './components/Home'
import MilkTeaMenu from './components/MilkTeaMenu'
import FruitTeaMenu from './components/FruitTeaMenu'
import SpecialtyMenu from './components/SpecialtyMenu'
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
import Transactions from './components/MangerComponets/Transaction';
import LoginTest from './components/LoginButton'

export default function App() {
  
  return (
    <AccessibilityProvider>
      <CartProvider>
        <main>
          <Routes>
            <Route path="/" element={<SystemSelect />} />
            <Route path="/kiosk" element={<Home />} />
            <Route path="/milktea" element={<MilkTeaMenu />} />
            <Route path="/fruittea" element={<FruitTeaMenu />} />
            <Route path="/specialty" element={<SpecialtyMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit/:id" element={<EditItem />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reportx" element={<XReport />} />
            <Route path="/reportz" element ={<ZReport/>} />
            <Route path="/products" element={<ManagerProducts />} />
            <Route path="/salesReport" element={<SalesReport/>}/>
            <Route path="/cashier" element={<CashierMenu />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/transactions" element={<Transactions/>}/>
            <Route path="/loginTest" element={<LoginTest />} />
          </Routes>
        </main>
      </CartProvider>
    </AccessibilityProvider>
  )
}
