import React from "react";
import { useManagerProductsController } from "../controllers/ManagerProductsController";

export default function ManagerProducts() {
  const {
    name,
    price,
    quantity,
    setName,
    setPrice,
    setQuantity,
    products,
    season,
    loading,
    error,
    handleSave,
    handleClear,
    doSeasonalView,
    //FIX THESE WHEN ALL PORTS ARE DONE (Below)
    goCashier,
    goSales,
    goProducts,
    goEmployees,
    goXReport,
    goUsageChart,
    goSalesReport,
    goZReport
  } = useManagerProductsController();

  return (
    <div className="flex min-h-screen bg-gray-100 text-sm">
      <aside className="w-40 bg-gray-300 p-4 space-y-2">
        <button className="managerButtons" onClick={goCashier}>
          Cashier View
        </button>

        <button className="managerButtons" onClick={goSales}>
          Recent Transactions
        </button>

        <button className="managerButtons" onClick={goProducts}>
          Products
        </button>

        <button className="managerButtons" onClick={goEmployees}>
          Employees
        </button>

        <button className="managerButtons" onClick={goXReport}>
          X Report
        </button>

        <button className="managerButtons" onClick={goUsageChart}>
          Usage Chart
        </button>

        <button className="managerButtons" onClick={goSalesReport}>
          Sales Report
        </button>

        <button className="managerButtons" onClick={goZReport}>
          Z Report
        </button>

        <button className="managerButtons" onClick={doSeasonalView}>
          {season ? "Seasonal (On)" : "Seasonal (Off)"}
        </button>
      </aside>

      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label>Name</label>
            <input
              className="border p-1 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="enter drink"
            />
          </div>

          <div className="flex flex-col">
            <label>Price $</label>
            <input
              className="border p-1 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5.50"
            />
          </div>

          <div className="flex flex-col">
            <label>Quantity</label>
            <input
              className="border p-1 rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 items-end">
            <button className="managerButtons" onClick={handleSave}>
              Add
            </button>
            <button className="managerButtons" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <table className="min-w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-2 border text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-2 border text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-2 border text-center">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">${p.price}</td>
                  <td className="p-2 border">{p.quantity}</td>
                  <td className="p-2 border">
                    actions later
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
