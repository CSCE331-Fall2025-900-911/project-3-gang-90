import React, { useEffect, useState } from "react";
import "./cashier.css";
import { Link } from "react-router-dom";
let server = import.meta.env.VITE_SERVER;


export default function Cashier() {
  const [drinkNames, setDrinkNames] = useState([]);
  const [drinkPrices, setDrinkPrices] = useState([]);
<<<<<<< HEAD
  const [menu, setMenu] = useState([]); // Store menu for id lookup
=======
  const [menu, setMenu] = useState([]);
>>>>>>> sprint-3
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

<<<<<<< HEAD
=======
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

>>>>>>> sprint-3
  async function fetchMenu() {
    try {
      const res = await fetch(server + '/api/menu');
      const data = await res.json();
      const toTitle = (str = "") =>
        str
          .toLowerCase()
          .replace(/\b\w/g, c => c.toUpperCase());
      const items = Array.isArray(data)
          ? data
              .filter(i => i.stat)
              .map(i => ({
                ...i,
                item_name: toTitle(i.name),
                item_id: i.id,
                price: Number(i.price)
              }))
          : [];
      return items;
    } catch (err) {
      return [];
    }
  }

  async function fetchEmployees() {
    try {
      const res = await fetch(server + '/api/employees');
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

<<<<<<< HEAD
=======
  // Get unique categories from menu
  const categories = React.useMemo(() => {
    const cats = menu.map(m => m.category || m.type || "Drink");
    return ["All Categories", ...Array.from(new Set(cats))];
  }, [menu]);

>>>>>>> sprint-3
  function toTitleCase(str) {
    return str
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

<<<<<<< HEAD
  function openDrinkMods(name, price) {
    setCurrentDrink({ name, price });
=======
  function openDrinkMods(name, price, category) {
    setCurrentDrink({ name, price, basePrice: price, category });
>>>>>>> sprint-3
    setCurrentMods([]);
    setShowMods(true);
  }

  function toggleModification(category, mod) {
    const key = `${category}:${mod}`;
<<<<<<< HEAD
    const existing = currentMods.find(m => m.startsWith(category + ":"));

    if (existing === key) {
      setCurrentMods(currentMods.filter(m => m !== existing));
      return;
    }

    const filtered = currentMods.filter(m => !m.startsWith(category + ":"));
    setCurrentMods([...filtered, key]);
=======
    if (category === "Toppings") {
      if (currentMods.includes(key)) {
        setCurrentMods(currentMods.filter(m => m !== key));
      } else {
        setCurrentMods([...currentMods, key]);
      }
    } else {
      const filtered = currentMods.filter(m => !m.startsWith(category + ":"));
      if (currentMods.includes(key)) {
        setCurrentMods(filtered);
      } else {
        setCurrentMods([...filtered, key]);
      }

      if (category === "Size" && currentDrink) {
        let newPrice = currentDrink.basePrice;
        if (mod === "Medium") newPrice = Number(currentDrink.basePrice) + 0.5;
        else if (mod === "Large") newPrice = Number(currentDrink.basePrice) + 1.0;
        else newPrice = Number(currentDrink.basePrice);
        setCurrentDrink({ ...currentDrink, price: newPrice });
      }
    }
>>>>>>> sprint-3
  }

  function addDrinkToOrder() {
    if (!currentDrink) return;
<<<<<<< HEAD
    const { name, price } = currentDrink;
    const mods = [...currentMods];
    const found = menu.find(m => m.name === name && m.price === price);
    const id = found ? found.id : undefined;
    setOrderItems(items => [...items, { name, price, mods, id }]);
=======
    const { name, price, category } = currentDrink;
    const mods = [...currentMods];
    setOrderItems(items => [...items, { name, price, mods, id, category, quantity: 1 }]);
>>>>>>> sprint-3
    setShowMods(false);
    setCurrentDrink(null);
    setCurrentMods([]);
  }

  useEffect(() => {
<<<<<<< HEAD
    let sum = orderItems.reduce((acc, d) => acc + (typeof d.price === 'number' ? d.price : Number(d.price) || 0), 0);
    setSubtotal(sum);
  }, [orderItems]);

=======
    let sum = orderItems.reduce((acc, d) => acc + ((typeof d.price === 'number' ? d.price : Number(d.price) || 0) * (d.quantity || 1)), 0);
    setSubtotal(sum);
  }, [orderItems]);

  function changeQuantity(index, delta) {
    setOrderItems(items => {
      return items.flatMap((item, i) => {
        if (i !== index) {
          return [item];
        }
        const newQty = (item.quantity || 1) + delta;
        if (newQty <= 0) {
          return [];
        }
        return [{ ...item, quantity: newQty }];
      });
    });
  }

>>>>>>> sprint-3
  async function confirmLogin() {
    setLoginError("");
    if (!loginName || !loginID) {
      setLoginError("Please enter both Name and Employee ID.");
      return;
    }
    try {
      const res = await fetch(server + '/api/employees');
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
    const items = orderItems
      .filter(it => it.id != null)
      .map(it => ({ id: it.id }));
    const body = {
      customerName,
      transactionTime: new Date().toISOString(),
      employeeId: cashierID || 1,
      totalPrice: Number((Number(subtotal || 0) * 1.0825).toFixed(2)),
      items
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("Fetch timed out");
      controller.abort();
    }, 10000);

    fetch(server + "/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
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
<<<<<<< HEAD
          {managerViewVisible && (
            <Link to="/products">
              Manager View
            </Link>
          )}
          <button onClick={() => setShowLogin(true)}>Change Cashier</button>
=======
          {//managerViewVisible && (
            //<Link to="/products">
              //Manager View
            //</Link>
          //)
          }
          <button onClick={() => setShowLogin(true)}>Change Cashier</button>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Filter by Category:</div>
            {categories.map((cat, idx) => (
              <button
                key={cat}
                style={{
                  marginBottom: 6,
                  background: selectedCategory === cat ? '#888' : '#e0e0e0',
                  color: selectedCategory === cat ? '#fff' : '#222',
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  width: '100%',
                  textAlign: 'left'
                }}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
>>>>>>> sprint-3
        </div>

        <div className="drink-menu">
          <div className="drink-grid">
<<<<<<< HEAD
            {drinkNames.map((name, idx) => (
              <button
                key={idx}
                className="drink-button"
                onClick={() =>
                  openDrinkMods(toTitleCase(name), drinkPrices[idx])
                }
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', padding: '12px' }}
              >
                <span style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: 4 }}>{toTitleCase(name)}</span>
                <span style={{ color: '#2a7b2a', fontWeight: 500, fontSize: '0.95em' }}>${Number(drinkPrices[idx]).toFixed(2)}</span>
              </button>
            ))}
=======
            {menu
              .filter(item =>
                selectedCategory === "All Categories" || (item.category || item.type || "Drink") === selectedCategory
              )
              .map((item, idx) => (
                <button
                  key={idx}
                  className="drink-button"
                  onClick={() =>
                    openDrinkMods(item.id ?? item.item_id, toTitleCase(item.name), item.price, item.category || item.type || "Drink")
                  }
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', padding: '12px' }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: 4 }}>{toTitleCase(item.name)}</span>
                  <span style={{ color: '#2a7b2a', fontWeight: 500, fontSize: '0.95em' }}>${Number(item.price).toFixed(2)}</span>
                  <span style={{ color: '#555', fontSize: '0.85em', marginTop: 2 }}>{item.category || item.type || "Drink"}</span>
                </button>
              ))}
>>>>>>> sprint-3
          </div>
        </div>

        <div className="order-panel">
          <div className="order-title">Current Order</div>

          <div className="order-item-box">
            {orderItems.length === 0 && <div>No items yet.</div>}

            {orderItems.map((item, i) => (
<<<<<<< HEAD
              <div key={i} className="order-item">
                <div>
                  {item.name} — ${
                    typeof item.price === 'number'
                      ? item.price.toFixed(2)
                      : `$${Number(item.price || 0).toFixed(2)}`
                  }
                </div>
=======
              <div key={i} className="order-item" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>
                    {item.name} — ${
                      typeof item.price === 'number'
                        ? item.price.toFixed(2)
                        : `$${Number(item.price || 0).toFixed(2)}`
                    }
                  </span>
                  <button style={{ marginLeft: 4, padding: '2px 8px', fontSize: '1em' }} onClick={() => changeQuantity(i, -1)}>-</button>
                  <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity || 1}</span>
                  <button style={{ padding: '2px 8px', fontSize: '1em' }} onClick={() => changeQuantity(i, 1)}>+</button>
                </div>
                <div style={{ fontSize: '0.85em', color: '#555' }}>{item.category || "Drink"}</div>
>>>>>>> sprint-3
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
<<<<<<< HEAD
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
=======
              <span><b>Size:</b></span>
              {["Small", "Medium", "Large"].map(mod => {
                const selected = currentMods.includes(`Size:${mod}`);
                let priceDiff = 0;
                if (mod === "Medium") priceDiff = 0.5;
                if (mod === "Large") priceDiff = 1.0;
                return (
                  <button
                    key={mod}
                    className={selected ? "modification selected" : "modification"}
                    onClick={() => toggleModification("Size", mod)}
                  >
                    {mod}
                    {priceDiff > 0 && (
                      <span style={{ fontSize: '0.8em', color: '#2a7b2a', marginLeft: 4 }}>+${priceDiff.toFixed(2)}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="row">
              <span><b>Ice Level:</b></span>
              {["Less", "Normal", "More"].map(mod => {
                const selected = currentMods.includes(`Ice Level:${mod}`);
                return (
                  <button
                    key={mod}
                    className={selected ? "modification selected" : "modification"}
                    onClick={() => toggleModification("Ice Level", mod)}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>

            <div className="row">
              <span><b>Sugar Level:</b></span>
              {["0%", "50%", "100%"].map(mod => {
                const selected = currentMods.includes(`Sugar Level:${mod}`);
                return (
                  <button
                    key={mod}
                    className={selected ? "modification selected" : "modification"}
                    onClick={() => toggleModification("Sugar Level", mod)}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>

            <div className="row">
              <span><b>Temperature:</b></span>
              {["Normal", "Hot"].map(mod => {
                const selected = currentMods.includes(`Temperature:${mod}`);
                return (
                  <button
                    key={mod}
                    className={selected ? "modification selected" : "modification"}
                    onClick={() => toggleModification("Temperature", mod)}
                  >
                    {mod}
                  </button>
                );
              })}
            </div>

            <div className="row">
              <span><b>Toppings:</b></span>
              {["Boba", "Honey Boba", "Lychee Jelly", "Coconut Jelly", "Pudding", "Ice Cream", "Oreo", "Mini Pearls", "Aiyu Jelly", "Crema", "Sub Crema", "Crystal Boba", "Mango Boba", "Strawberry Boba", "Coffee Jelly", "Honey Jelly", "Peach Boba", "Fresh Milk"].map(mod => {
                const selected = currentMods.includes(`Toppings:${mod}`);
                return (
                  <button
                    key={mod}
                    style={{ fontSize: "0.7rem" }}
                    className={selected ? "modification selected" : "modification"}
                    onClick={() => toggleModification("Toppings", mod)}
                  >
                    {mod}
                  </button>
                );
              })}
>>>>>>> sprint-3
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
