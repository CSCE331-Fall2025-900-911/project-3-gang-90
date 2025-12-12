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

const API_BASE = "https://project-3-gang-90-backend.onrender.com/api";

export default function ManagerProducts() {
  return (
    <MangerPage pageName="Products" child={<ManagerProductsContent />} />
  );
}

function ManagerProductsContent() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

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
          category: item.category,
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
      const res = await fetch(`${API_BASE}/seasonal-menu`);
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
    setCategory("");
  };

  const handleSaveNew = async () => {
    const n = safeTrim(name);
    const p = safeTrim(price);
    const q = safeTrim(quantity);
    const c = safeTrim(category);

    if (!n || !p || !q || !c) {
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
      const body = { name: n, price: priceNum, quantity: qtyNum, category: c };
      const url = season
        ? `${API_BASE}/seasonal-menu`
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
          category: c,
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
      updated._deleted
        ? prev.filter((p) => p.id !== updated.id)
        : prev.map((p) => (p.id === updated.id ? updated : p))
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
        <TextField
          label="Category"
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
            <TableCell>Category</TableCell>
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
                <TableCell>{p.category}</TableCell>
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



function ItemEditorDialog({ open, product, onClose, onSave }) 
{
  const [name, setName] = useState("");
  const [popularity, setPopularity] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");

  const [itemIngredients, setItemIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  useEffect(() => {
    if (!product) return;

    setName(product.name ?? "");
    setPopularity(String(product.quantity ?? 0));
    setPrice(String(product.price ?? ""));
    setQuantity(String(product.quantity ?? 0));
    setCategory(product.category ?? "");

    loadItemIngredients(product);
    loadAllIngredients();
  }, [product]);

  async function handleDelete() {
    if (!product) return;

    try {
      const isSeasonal = product.id < 0;
      const itemId = Math.abs(product.id);

      const url = isSeasonal ? `${API_BASE}/seasonal-menu/${itemId}` : `${API_BASE}/menu/${itemId}`;

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete item");
        return;
      }

      if (onSave) {
        onSave({ ...product, _deleted: true });
      }
      
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error deleting itemm");
    }
  }

  async function loadItemIngredients(prod) {
    try {
      const isSeasonal = prod.id < 0;
      const itemId = Math.abs(prod.id);

      const res = await fetch(
        `${API_BASE}/menu/${itemId}/ingredients?seasonal=${isSeasonal}`
      );
      if (!res.ok) throw new Error("Failed to load item ingredients");

      const data = await res.json();
      setItemIngredients(data);
    } catch (err) {
      console.error(err);
      setItemIngredients([]);
    }
  }

  async function loadAllIngredients() {
    try {
      const res = await fetch(`${API_BASE}/ingredients`);
      if (!res.ok) throw new Error("Failed to load ingredients");

      const data = await res.json();
      setAllIngredients(data);
    } catch (err) {
      console.error(err);
      setAllIngredients([]);
    }
  }

  async function handleAddIngredient(ingredientId) {
    if (!product) return;

    try {
      const isSeasonal = product.id < 0;
      const itemId = Math.abs(product.id);

      const res = await fetch(`${API_BASE}/menu/${itemId}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientId, isSeasonal }),
      });

      if (!res.ok) {
        console.error("Failed to add ingredient");
        alert("Failed to add ingredient");
        return;
      }

      await loadItemIngredients(product);
    } catch (err) {
      console.error(err);
      alert("Failed to add ingredient");
    }
  }

  async function handleRemoveIngredient(ingredientId) {
    if (!product) return;

    try {
      const isSeasonal = product.id < 0;
      const itemId = Math.abs(product.id);

      const res = await fetch(
        `${API_BASE}/menu/${itemId}/ingredients/${ingredientId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        console.error("Failed to remove ingredient");
        alert("Failed to remove ingredient");
        return;
      }

      // refresh ingredient list
      await loadItemIngredients(product);
    } catch (err) {
      console.error(err);
      alert("Failed to remove ingredient");
    }
  }

  if (!product) return null;

  const handleSave = () => {
    const n = name.trim();
    const popStr = popularity.trim();
    const priceStr = price.trim();
    const qtyStr = quantity.trim();
    const ctgStr = category.trim();

    if (!n || !popStr || !priceStr || !qtyStr || !ctgStr) {
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
      category: ctgStr,
    };

    if (onSave) onSave(updated);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent dividers>
        <Stack direction="row" spacing={2} mt={1} mb={3}>
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
          <TextField
            label="Category"
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Stack>

        <h4>Ingredients in this drink</h4>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemIngredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No ingredients yet.
                </TableCell>
              </TableRow>
            ) : (
              itemIngredients.map((ing) => (
                <TableRow key={ing.ingredient_id ?? ing.id}>
                  <TableCell>{ing.ingredient_id ?? ing.id}</TableCell>
                  <TableCell>{ing.ingredient_name ?? ing.name}</TableCell>
                  <TableCell>{ing.category ?? ""}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleRemoveIngredient(ing.ingredient_id ?? ing.id)
                      }
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div style={{ height: 16 }} />

        <h4>All ingredients</h4>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell width={100}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allIngredients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No ingredients found.
                </TableCell>
              </TableRow>
            ) : (
              allIngredients.map((ing) => (
                <TableRow key={ing.ingredient_id ?? ing.id}>
                  <TableCell>{ing.ingredient_id ?? ing.id}</TableCell>
                  <TableCell>{ing.ingredient_name ?? ing.name}</TableCell>
                  <TableCell>{ing.category ?? ""}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleAddIngredient(ing.ingredient_id ?? ing.id)
                      }
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="#dc143c">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}
