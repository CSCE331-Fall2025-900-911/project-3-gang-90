
import React, { useEffect, useState } from "react";
import "./cashier.css";
let server = import.meta.env.VITE_SERVER;

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pay, setPay] = useState("");

  async function loadEmployees() {
    try {
      const response = await fetch(server + "/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setEmployees([]);
    }
  }

  async function addEmployee() {
    await fetch(server + "/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, pay: parseFloat(pay) })
    });

    setShowPopup(false);
    setName("");
    setRole("");
    setPay("");

    loadEmployees();
  }

  async function deleteEmployee(id) {
    await fetch(server + `/employees/${id}`, { method: "DELETE" });
    loadEmployees();
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const go = (path) => window.location.href = path;

  return (
    <div className="cashier-root">

      <div className="top-bar">
        <div className="top-title">Employees</div>
        <div className="spacer"></div>
        <div className="top-time">{new Date().toLocaleTimeString()}</div>
      </div>

      <div className="layout">

        <div className="sidebar">
          <button onClick={() => go("/cashier")}>Cashier View</button>
          <button onClick={() => go("/transactions")}>Recent Transactions</button>
          <button onClick={() => go("/products")}>Products</button>
          <button onClick={() => go("/employees")}>Employees</button>
          <button onClick={() => go("/reportx")}>X Report</button>
          <button onClick={() => go("/usage-chart")}>Usage Chart</button>
          <button onClick={() => go("/salesRieport")}>Sales Report</button>
          <button onClick={() => go("/reportz")}>Z Report</button>
        </div>

        <div className="employee-table-container">

          <table className="emp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Role</th>
                <th>Pay</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>${emp.pay}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="primary-button"
            onClick={() => setShowPopup(true)}
            style={{ marginTop: "15px" }}
          >
            Add Employee
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add Employee</h2>

            <label>Employee Name:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Role:</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} />

            <label>Pay:</label>
            <input value={pay} onChange={(e) => setPay(e.target.value)} />

            <div className="row">
              <button className="confirm-btn" onClick={addEmployee}>Confirm Add</button>
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
