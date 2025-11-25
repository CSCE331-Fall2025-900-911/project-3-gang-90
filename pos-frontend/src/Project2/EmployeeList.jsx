
import React, { useEffect, useState } from "react";
import "./cashier.css";
import { Link } from "react-router-dom";
let server = import.meta.env.VITE_SERVER;

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pay, setPay] = useState("");

  async function loadEmployees() {
    try {
      const response = await fetch(server + "/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setEmployees([]);
    }
  }

  async function addEmployee() {
    await fetch(server + "/api/employees", {
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
    await fetch(server + `/api/employees/${id}`, { method: "DELETE" });
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
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/cashier"}>Cashier</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/transactions"}>Transactions</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/products"}>Products</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/employees"}>Employees</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/reportx"}>X-Report</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/usageReport"}>Usage Charge</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/salesReport"}>Sales Report</Link>
          <Link className='border-black border-2 rounded-md px-6 py-2 bg-gray-400 hover:bg-gray-600' to={"/reportz"}>Z-Report</Link>
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
