import React, { useEffect, useState } from "react";
import MangerPage from "../components/MangerComponets/MangerPage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Stack,
} from "@mui/material";

const API_BASE = "https://project-3-gang-90-backend.onrender.com/api";

const REFILL_URL = `${API_BASE}/ingredients/refill`;
const DECREASE_URL = (id) => `${API_BASE}/ingredients/${id}/decrease`;

export default function ManagerIngredients() {
  return <MangerPage pageName="Ingredients" child={<ManagerIngredientsContent />} />;
}

function ManagerIngredientsContent() {
  const [ingredients, setIngredients] = useState([]);
  const [deltaById, setDeltaById] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/ingredients`);
      if (!res.ok) throw new Error("Failed to load ingredients");

      const data = await res.json();
      setIngredients(
        (data ?? []).map((ing) => ({
          id: ing.id ?? ing.ingredient_id,
          name: ing.name ?? ing.ingredient_name,
          quantity: ing.quantity ?? 0,
        }))
      );
    } catch (e) {
      console.error(e);
      setError("Error loading ingredients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const parsePositiveInt = (s) => {
    const n = Number(String(s ?? "").trim());
    if (!Number.isFinite(n)) return null;
    const i = Math.floor(n);
    return i > 0 ? i : null;
  };

  const setDelta = (id, value) => {
    setDeltaById((prev) => ({ ...prev, [id]: value }));
  };

  const clearDelta = (id) => {
    setDeltaById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handlePlus = async (ing) => {
    const amt = parsePositiveInt(deltaById[ing.id]);
    if (!amt) {
      alert("Enter a positive amount to add.");
      return;
    }

    try {
      const res = await fetch(REFILL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: ing.name, quantity: amt }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Refill failed:", res.status, text);
        alert(`Failed to add inventory (status ${res.status})`);
        return;
      }

      clearDelta(ing.id);
      await fetchIngredients();
    } catch (e) {
      console.error(e);
      alert("Error adding inventory");
    }
  };

  const handleMinus = async (ing) => {
    const amt = parsePositiveInt(deltaById[ing.id]);
    if (!amt) {
      alert("Enter a positive amount to subtract.");
      return;
    }

    try {
      const res = await fetch(DECREASE_URL(ing.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: amt }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Decrease failed:", res.status, text);
        alert(`Failed to subtract inventory (status ${res.status})`);
        return;
      }

      clearDelta(ing.id);
      await fetchIngredients();
    } catch (e) {
      console.error(e);
      alert("Error subtracting inventory");
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <Button variant="outlined" onClick={fetchIngredients} disabled={loading}>
          Refresh
        </Button>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell width={120}>Amount</TableCell>
            <TableCell width={340}>Adjust</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No ingredients found.
              </TableCell>
            </TableRow>
          ) : (
            ingredients.map((ing) => (
              <TableRow key={ing.id}>
                <TableCell>{ing.name}</TableCell>
                <TableCell>{ing.quantity}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button variant="contained" size="small" onClick={() => handlePlus(ing)}>
                      +
                    </Button>

                    <TextField
                      size="small"
                      label="amount"
                      value={deltaById[ing.id] ?? ""}
                      onChange={(e) => setDelta(ing.id, e.target.value)}
                      sx={{ width: 140 }}
                    />

                    <Button
                      variant="contained"
                      size="small"
                      color = "red" //give real color later
                      onClick={() => handleMinus(ing)}
                    >
                      -
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
