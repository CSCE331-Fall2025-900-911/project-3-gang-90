import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Menu from "./pages/Menu.jsx";
import Manager from "./pages/ManagerView.jsx";
import Checkout from "./pages/Checkout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Menu</Link> |{" "}
        <Link to="/manager">Manager</Link> |{" "}
        <Link to="/checkout">Checkout</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
