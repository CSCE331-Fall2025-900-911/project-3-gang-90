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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

const API_BASE = "http://localhost:3000";

export default function ManagerProducts() {
  return (
    <MangerPage pageName="Products" child={<ManagerProductsContent />} />
  );
}

function ManagerProductsContent() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [products, setProducts] = useState([]);
  const [season, setSeason] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const safeTrim = (s) => (s == null ? "" : s.trim());

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/menu`);
      if (!res.ok) throw new Error("Failed to load menu");
      const data = await res.json();
      setProducts(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.popularity ?? 0,
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
          id: -item.id,
          name: item.name,
          price: item.price,
          quantity: item.popularity ?? 0,
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

  const handleSaveNew = async () => {
    const n = safeTrim(name);
    const p = safeTrim(price);
    const q = safeTrim(quantity);

    if (!n || !p || !q) {
      alert("Missing fields");
      return;
    }

    let priceNum, qtyNum;
    try {
      priceNum = parseFloat(p);
      qtyNum = parseInt(q, 10);
    } catch {
      alert("Invalid types");
      return;
    }

    try {
      const body = { name: n, price: priceNum, quantity: qtyNum };
      const url = season
        ? `${API_BASE}/menu/seasonal`
        : `${API_BASE}/menu`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add item");
      const created = await res.json();

      setProducts((prev) => [
        ...prev,
        {
          id: created.id,
          name: n,
          price: priceNum,
          quantity: qtyNum,
        },
      ]);

      clearInputs();
    } catch (e) {
      console.error(e);
      alert("Failed to save item");
    }
  };

  const handleSeasonToggle = async (event) => {
    const next = event.target.checked;
    setSeason(next);
    if (next) {
      await fetchSeasonalMenu();
    } else {
      await fetchMenu();
    }
  };

  const handleOpenEditor = (product) => {
    setEditingProduct(product);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setEditingProduct(null);
  };

  const handleSaveEditor = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  return (
    <div>
      <Stack direction="row" spacing={2} mb={3} alignItems="flex-end">
        <TextField
          label="Name"
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Price $"
          size="small"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Quantity"
          size="small"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Button variant="contained" onClick={handleSaveNew}>
          Add
        </Button>
        <Button variant="outlined" onClick={clearInputs}>
          Clear
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={season}
              onChange={handleSeasonToggle}
              color="primary"
            />
          }
          label={season ? "Seasonal (On)" : "Seasonal (Off)"}
        />
      </Stack>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Products table */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell width={120}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No products yet.
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenEditor(p)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ItemEditorDialog
        open={editorOpen}
        product={editingProduct}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
      />
    </div>
  );
}

//WIP
function ItemEditorDialog({ open, product, onClose, onSave }) {
  const [name, setName] = useState("");
  const [popularity, setPopularity] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (!product) return;
    setName(product.name ?? "");
    setPopularity(String(product.quantity ?? 0));
    setPrice(String(product.price ?? ""));
    setQuantity(String(product.quantity ?? 0));
  }, [product]);

  if (!product) return null;

  const handleSave = () => {
    const n = name.trim();
    const popStr = popularity.trim();
    const priceStr = price.trim();
    const qtyStr = quantity.trim();

    if (!n || !popStr || !priceStr || !qtyStr) {
      alert("Missing fields");
      return;
    }

    let popNum, priceNum, qtyNum;
    try {
      popNum = parseInt(popStr, 10);
      priceNum = parseFloat(priceStr);
      qtyNum = parseInt(qtyStr, 10);
    } catch {
      alert("Invalid types");
      return;
    }

    const updated = {
      ...product,
      name: n,
      price: priceNum,
      quantity: qtyNum,
      popularity: popNum,
    };

    if (onSave) onSave(updated);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} mt={1}>
          <TextField
            label="Name"
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Popularity"
            size="small"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
          />
          <TextField
            label="Price $"
            size="small"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            label="Quantity"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Stack>

        {/* Ing WIP*/}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}