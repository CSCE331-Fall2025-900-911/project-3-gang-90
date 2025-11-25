//Decrepit file, may be deleted later
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

const safeTrim = (s) => (s == null ? "" : s.trim());

export function useManagerProductsController() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [products, setProducts] = useState([]);
  const [season, setSeason] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/menu`);
      if (!res.ok) throw new Error("Failed to load menu");

      const data = await res.json();

      setProducts(
        data.map((item) => ({
          id: item.id,//may need to be fixed later
          name: item.name,
          price: item.price,
          quantity: item.popularity ?? 0
        }))
      );
    } catch (e) {
      console.error(e);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasonalMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/menu/seasonal`);
      if (!res.ok) throw new Error("Failed to load seasonal menu");

      const data = await res.json();

      setProducts(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.popularity ?? 0
        }))
      );
    } catch (e) {
      console.error(e);
      setError("Error loading seasonal products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const clearInputs = () => {
    setName("");
    setPrice("");
    setQuantity("");
  };

  const handleSave = async () => {
    const n = safeTrim(name);
    const p = safeTrim(price);
    const q = safeTrim(quantity);

    if (!n || !p || !q) {
      alert("Missing fields");
      return;
    }

    let priceNum;
    let qtyNum;
    try {
      priceNum = parseFloat(p);
      qtyNum = parseInt(q, 10);
    } catch {
      alert("Invalid types");
      return;
    }

    try {
      const body = {
        name: n,
        price: priceNum,
        quantity: qtyNum
      };

      const url = season
        ? `${API_BASE}/menu/seasonal`
        : `${API_BASE}/menu`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Failed to add item");

      const created = await res.json();

      setProducts((prev) => [
        ...prev,
        {
          id: created.id,
          name: n,
          price: priceNum,
          quantity: qtyNum
        }
      ]);

      clearInputs();
    } catch (e) {
      console.error(e);
      alert("Failed to save item");
    }
  };

  const handleClear = () => {
    clearInputs();
  };

  const doSeasonalView = async () => {
    if (season) {
      await fetchMenu();
      setSeason(false);
    } else {
      await fetchSeasonalMenu();
      setSeason(true);
    }
  };

  const goCashier = () => navigate("/cashier");
  const goSales = () => navigate("/transactions");
  const goProducts = () => navigate("/products");
  const goEmployees = () => navigate("/employees");
  const goXReport = () => navigate("/xreport");
  const goUsageChart = () => navigate("/usageChart");
  const goSalesReport = () => navigate("/salesReport");
  const goZReport = () => navigate("/reportz");

  return {
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

    goCashier,
    goSales,
    goProducts,
    goEmployees,
    goXReport,
    goUsageChart,
    goSalesReport,
    goZReport
  };
}
