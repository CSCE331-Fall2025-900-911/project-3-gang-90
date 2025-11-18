import React from 'react'
import { CartProvider } from './components/CartContext'
import { AccessibilityProvider } from './components/AccessibilityContext'
import { Routes, Route, Link } from 'react-router-dom'
import SystemSelect from "./components/SystemSelect";
import Home from './components/Home'
import FreshBrewMenu from './components/FreshBrewMenu'
import MilkySeriesMenu from './components/MilkySeriesMenu'
import FruitBeverageMenu from './components/FruityBeverageMenu'
import NonCaffeinatedMenu from './components/NonCaffeinatedMenu'
import IceBlendedMenu from './components/IceBlendedMenu'
import MatchaSeriesMenu from './components/MatchaSeriesMenu'
import Cart from './components/Cart'
import EditItem from './components/EditItem'
import Settings from './components/Settings'
import MenuBoard from './components/MenuBoard'

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

import ManagerProducts from "./Project2/ManagerProducts"
import SalesReport from './components/MangerComponets/SalesReport'

export default function App() {
  
  return (
    <AccessibilityProvider>
      <CartProvider>
        <main>
          <Routes>
            <Route path="/" element={<SystemSelect />} />
            <Route path="/kiosk" element={<Home />} />
            <Route path="/freshbrew" element={<FreshBrewMenu />} />
            <Route path="/milkyseries" element={<MilkySeriesMenu />} />
            <Route path="/fruity" element={<FruitBeverageMenu />} />
            <Route path="/noncaffeinated" element={<NonCaffeinatedMenu />} />
            <Route path="/iceblended" element={<IceBlendedMenu />} />
            <Route path="/matcha" element={<MatchaSeriesMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit/:id" element={<EditItem />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/products" element={<ManagerProducts />} />
            <Route path="/salesReport" element={<SalesReport/>}/>
            <Route path="/cashier" element={<CashierMenu />} />
            <Route path="/usageReport" element={<UsageReport/>}/>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/transactions" element={<Transactions/>}/>
            <Route path="/loginTest" element={<LoginTest />} />
            <Route path="/menuboard" element={<MenuBoard />} />
          </Routes>
        </main>
      </CartProvider>
    </AccessibilityProvider>
  )
}
