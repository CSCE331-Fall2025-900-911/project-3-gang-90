import React, { useEffect, useState } from "react";
import "./cashier.css";
let server = import.meta.env.VITE_SERVER;


export default function Cashier() {
  const [drinkNames, setDrinkNames] = useState([]);
  const [drinkPrices, setDrinkPrices] = useState([]);
  const [menu, setMenu] = useState([]); // Store menu for id lookup
  const [orderItems, setOrderItems] = useState([]);
  const [employeeName, setEmployeeName] = useState("Logged Out");
  const [managerViewVisible, setManagerViewVisible] = useState(false);
  const [cashierID, setCashierID] = useState(0);

  const [subtotal, setSubtotal] = useState(0);
  const [currentDrink, setCurrentDrink] = useState(null);
  const [currentMods, setCurrentMods] = useState([]);

  const [showMods, setShowMods] = useState(false);
  const [showCharge, setShowCharge] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginID, setLoginID] = useState("");
  const [loginError, setLoginError] = useState("");

  async function fetchMenu() {
    try {
      const res = await fetch(server + '/menu');
      const data = await res.json();
      const toTitle = (str = "") =>
        str
          .toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase());
      const items = Array.isArray(data)
        ? data
            .filter(i => i.is_active)
            .map(i => ({
              name: toTitle(i.item_name),
              price: i.price,
              id: i.item_id
            }))
        : [];
      return items;
    } catch (err) {
      return [];
    }
  }

  async function fetchEmployees() {
    try {
      const res = await fetch(server + '/employees');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  useEffect(() => {
    async function loadMenu() {
      const menuData = await fetchMenu();
      setMenu(menuData);
      setDrinkNames(menuData.map(m => m.name));
      setDrinkPrices(menuData.map(m => m.price));
    }
    loadMenu();
  }, []);

  function toTitleCase(str) {
    return str
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  function openDrinkMods(name, price) {
    setCurrentDrink({ name, price });
    setCurrentMods([]);
    setShowMods(true);
  }

  function toggleModification(category, mod) {
    const key = `${category}:${mod}`;
    const existing = currentMods.find(m => m.startsWith(category + ":"));

    if (existing === key) {
      setCurrentMods(currentMods.filter(m => m !== existing));
      return;
    }

    const filtered = currentMods.filter(m => !m.startsWith(category + ":"));
    setCurrentMods([...filtered, key]);
  }

  function addDrinkToOrder() {
    if (!currentDrink) return;
    const { name, price } = currentDrink;
    const mods = [...currentMods];
    // Find id for the selected drink using menu
    const found = menu.find(m => m.name === name && m.price === price);
    const id = found ? found.id : undefined;
    setOrderItems(items => [...items, { name, price, mods, id }]);
    setShowMods(false);
    setCurrentDrink(null);
    setCurrentMods([]);
  }

  useEffect(() => {
    let sum = orderItems.reduce((acc, d) => acc + (typeof d.price === 'number' ? d.price : Number(d.price) || 0), 0);
    setSubtotal(sum);
  }, [orderItems]);

  async function confirmLogin() {
    setLoginError("");
    if (!loginName || !loginID) {
      setLoginError("Please enter both Name and Employee ID.");
      return;
    }
    try {
      const res = await fetch(server + '/employees');
      const employees = await res.json();
      const emp = employees.find(
        e =>
          (e.name || '').toLowerCase() === loginName.toLowerCase() &&
          String(e.employee_id || e.id) === loginID
      );
      if (!emp) {
        setLoginError("Login failed. Try again.");
        return;
      }
      setEmployeeName("Hello, " + emp.name);
      setCashierID(emp.employee_id || emp.id);
      setManagerViewVisible(emp.role === "manager");
      setShowLogin(false);
    } catch (err) {
      setLoginError("Login failed. Try again.");
    }
  }

  function confirmCharge() {
    if (!customerName) return;
    const transaction = {
      customerName,
      transactionTime: new Date().toISOString(),
      employeeId: cashierID || 1,
      totalPrice: Number(subtotal),
    };
    const item = orderItems.map((item) => ({
      itemId: item.id || item.name,
      mods: item.mods || [],
      price: item.price
    }));
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("Fetch timed out");
      controller.abort();
    }, 10000);

    fetch(server + "/menu/TransactionAndDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({ transaction, item }),
    })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) {
          console.error("Error:", res.status);
        }
        return res.json();
      })
      .then(() => {
        setOrderItems([]);
        setSubtotal(0);
        setCustomerName("");
        setShowCharge(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error("Error:", err);
        setOrderItems([]);
        setSubtotal(0);
        setCustomerName("");
        setShowCharge(false);
      });
  }


  return (
    <div className="cashier-root">

      <div className="top-bar">
        <span className="top-title">Cashier Interface</span>
        <span className="spacer"></span>
        <span className="top-time">{employeeName}</span>
      </div>

      <div className="layout">

        <div className="sidebar">
          {managerViewVisible && (
            <button onClick={() => console.log("Go Manager View")}>
              Manager View
            </button>
          )}
          <button onClick={() => setShowLogin(true)}>Change Cashier</button>
        </div>

        <div className="drink-menu">
          <div className="drink-grid">
            {drinkNames.map((name, idx) => (
              <button
                key={idx}
                className="drink-button"
                onClick={() =>
                  openDrinkMods(name, drinkPrices[idx])
                }
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="order-panel">
          <div className="order-title">Current Order</div>

          <div className="order-item-box">
            {orderItems.length === 0 && <div>No items yet.</div>}

            {orderItems.map((item, i) => (
              <div key={i} className="order-item">
                <div>
                  {item.name} — ${
                    typeof item.price === 'number'
                      ? item.price.toFixed(2)
                      : `$${Number(item.price || 0).toFixed(2)}`
                  }
                </div>
                <div className="mods">
                  {item.mods.join(", ")}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="line">
              <span>Subtotal:</span>
              <span>{Number(subtotal || 0).toFixed(2)}</span>
            </div>

            <div className="line">
              <span>Tax:</span>
              <span>{(Number(subtotal || 0) * 0.0825).toFixed(2)}</span>
            </div>

            <div className="line">
              <span>Total:</span>
              <span>{(Number(subtotal || 0) * 1.0825).toFixed(2)}</span>
            </div>

            <button
              className="charge-button"
              onClick={() => setShowCharge(true)}
            >
              Charge {(Number(subtotal || 0) * 1.0825).toFixed(2)}
            </button>
          </div>
        </div>

      </div>

      {showMods && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Modifications</h2>

            <div className="row">
              <span>Ice Level:</span>
              {["Less", "Normal", "More"].map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModification("Ice Level", mod)}
                >
                  {mod}
                </button>
              ))}
            </div>

            <div className="row">
              <span>Sugar Level:</span>
              {["0%", "50%", "100%"].map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModification("Sugar Level", mod)}
                >
                  {mod}
                </button>
              ))}
            </div>

            <button className="confirm-btn" onClick={addDrinkToOrder}>
              Confirm
            </button>
            <button className="cancel-btn" onClick={() => setShowMods(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showCharge && (
        <div className="popup-overlay">
          <div className="popup">
            <label>Enter Customer Name:</label>
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
            />

            <button onClick={confirmCharge}>Confirm Charge</button>
            <button onClick={() => setShowCharge(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="popup-overlay">
          <div className="popup">
            <label>Enter Name:</label>
            <input
              value={loginName}
              onChange={e => setLoginName(e.target.value)}
            />

            <label>Enter ID:</label>
            <input
              value={loginID}
              onChange={e => setLoginID(e.target.value)}
            />

            <div className="error">{loginError}</div>

            <button onClick={confirmLogin}>Login</button>
            <button onClick={() => setShowLogin(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
