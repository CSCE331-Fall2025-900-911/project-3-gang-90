import React, { useEffect, useState } from "react";
import "./cashier.css";
import { Link } from "react-router-dom";
let server = import.meta.env.VITE_SERVER;


export default function Cashier() {
  const [drinkNames, setDrinkNames] = useState([]);
  const [drinkPrices, setDrinkPrices] = useState([]);
  const [menu, setMenu] = useState([]);
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

  const [searchText, setSearchText] = useState("");


  const [selectedCategory, setSelectedCategory] = useState("All Categories");

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
                price: Number(i.price),
                is_seasonal: i.seasonal
              }))
          : [];
      return items;
    } catch (err) {
      return [];
    }
  }

  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

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

  const categories = React.useMemo(() => {
    const cats = menu.map(m => toTitleCase(m.category) || m.type || "Drink");
    return ["All Categories", "Seasonal", ...Array.from(new Set(cats))];
  }, [menu]);

  function openDrinkMods(id, name, price, category) {
    setCurrentDrink({ id, name, price, basePrice: price, category });
    setCurrentMods([]);
    setShowMods(true);
  }

  function toggleModification(category, mod) {
    const key = `${category}:${mod}`;
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
  }

  function addDrinkToOrder() {
    if (!currentDrink) return;
    const { id, name, price, category } = currentDrink;
    const mods = [...currentMods];
    setOrderItems(items => [...items, { name, price, mods, id, category, quantity: 1 }]);
    setShowMods(false);
    setCurrentDrink(null);
    setCurrentMods([]);
  }

  useEffect(() => {
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
      .then(() => decrementIngredients(orderItems))
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
          <button onClick={() => setShowLogin(true)}>Change Cashier</button>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search drinks..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                border: '2px solid #3d3d3dff',
                fontSize: '0.9rem'
              }}
            />
          </div>
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
        </div>

        <div className="drink-menu">
          <div className="drink-grid">
            {menu
              .filter(item => {
                const matchesCategory =
                  selectedCategory === "All Categories" ||
                  (selectedCategory === "Seasonal" && item.is_seasonal) ||
                  (toTitleCase(item.category) || toTitleCase(item.type) || "Drink") === selectedCategory;

                const matchesSearch =
                  !searchText ||
                  (item.name || "").toLowerCase().includes(searchText.toLowerCase());

                return matchesCategory && matchesSearch;
              })
              .map((item, idx) => (
                <button
                  key={idx}
                  className="drink-button"
                  onClick={() =>
                    openDrinkMods(item.id ?? item.item_id, toTitleCase(item.name), item.price, toTitleCase(item.category || item.type || "Drink"))
                  }
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', padding: '12px' }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: 4 }}>{toTitleCase(item.name)}</span>
                  <span style={{ color: '#2a7b2a', fontWeight: 500, fontSize: '0.95em' }}>${Number(item.price).toFixed(2)}</span>
                  <span style={{ color: '#555', fontSize: '0.85em', marginTop: 2 }}>{toTitleCase(item.category || item.type || "Drink")}</span>
                  {item.is_seasonal && (
                    <span
                      style={{
                        marginTop: 4,
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        color: '#b00000'
                      }}
                    >
                      Seasonal
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>

        <div className="order-panel">
          <div className="order-title">Current Order</div>

          <div className="order-item-box">
            {orderItems.length === 0 && <div>No items yet.</div>}

            {orderItems.map((item, i) => (
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
