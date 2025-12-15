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

let server = import.meta.env.VITE_SERVER;

export default function ManagerProducts() {
  return (
    <MangerPage pageName="Products" child={<ManagerProductsContent />} />
  );
}

function ManagerProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [seasonal, setSeasonal] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [itemIngredients, setItemIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);

  const toTitleCase = (str = "") =>
    str.replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

  useEffect(() => {
    if (!editingProduct) return;

    fetchItemIngredients(editingProduct.id);
    fetchAllIngredients();
  }, [editingProduct]);

  async function fetchMenu() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${server}/api/menu`);
      if (!res.ok) throw new Error("Failed to load menu");

      const data = await res.json();
      setProducts(
        data.map(item => ({
          id: item.id,
          name: toTitleCase(item.name),
          price: Number(item.price),
          category: toTitleCase(item.category),
          seasonal: Boolean(item.seasonal),
          popularity: item.popularity ?? 0,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  function clearInputs() {
    setName("");
    setPrice("");
    setCategory("");
    setSeasonal(false);
  }

  async function handleAdd() {
    if (!name || !price || !category) {
      alert("Missing fields");
      return;
    }

    try {
      const body = {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        seasonal: seasonal,
      };

      const res = await fetch(`${server}/api/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add item");

      const created = await res.json();

      setProducts(prev => [
        ...prev,
        {
          id: created.id,
          name: toTitleCase(body.name),
          price: body.price,
          category: body.category,
          seasonal,
          popularity: 0,
        },
      ]);

      clearInputs();
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  }

  function openEditor(product) {
    setItemIngredients([]);
    setAllIngredients([]);
    setEditingProduct(product);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditingProduct(null);
    setEditorOpen(false);
  }

  function handleEditorSave(updated) {
    setProducts(prev =>
      updated._deleted
        ? prev.filter(p => p.id !== updated.id)
        : prev.map(p => (p.id === updated.id ? updated : p))
    );
  }

  async function fetchItemIngredients(itemId) {
    try {
      setIngredientsLoading(true);
      const res = await fetch(
        `${server}/api/menu/${itemId}/ingredients?seasonal=${editingProduct.seasonal}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItemIngredients(data);
    } catch {
      setItemIngredients([]);
    } finally {
      setIngredientsLoading(false);
    }
  }

  async function fetchAllIngredients() {
    try {
      const res = await fetch(`${server}/api/ingredients`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAllIngredients(data);
    } catch {
      setAllIngredients([]);
    }
  }

  async function handleAddIngredient(ingredientId) {
    if (!editingProduct) return;

    const res = await fetch(
      `${server}/api/menu/${editingProduct.id}/ingredients`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientId }),
      }
    );

    if (!res.ok) {
      alert("Failed to add ingredient");
      return;
    }

    fetchItemIngredients(editingProduct.id);
  }

  async function handleRemoveIngredient(ingredientId) {
    await fetch(
      `${server}/api/menu/${editingProduct.id}/ingredients/${ingredientId}`,
      { method: "DELETE" }
    );
    fetchItemIngredients(editingProduct.id);
  }

  return (
    <div>
      <Stack direction="row" spacing={2} mb={3} alignItems="flex-end">
        <TextField
          label="Name"
          size="small"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TextField
          label="Price"
          size="small"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <TextField
          label="Category"
          size="small"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={seasonal}
              onChange={e => setSeasonal(e.target.checked)}
            />
          }
          label={seasonal ? "Seasonal" : "Regular"}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
        <Button variant="outlined" onClick={clearInputs}>
          Clear
        </Button>
      </Stack>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Seasonal</TableCell>
            <TableCell width={120}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No products.
              </TableCell>
            </TableRow>
          ) : (
            products.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price.toFixed(2)}</TableCell>
                <TableCell>{toTitleCase(p.category)}</TableCell>
                <TableCell>{p.seasonal ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEditor(p)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ItemEditorDialog
        open={editorOpen && Boolean(editingProduct)}
        product={editingProduct}
        onClose={closeEditor}
        onSave={handleEditorSave}
        itemIngredients={itemIngredients}
        allIngredients={allIngredients}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
        ingredientsLoading={ingredientsLoading}
      />
    </div>
  );
}

function ItemEditorDialog({open, product, onClose, onSave, itemIngredients, allIngredients, onAddIngredient, onRemoveIngredient, ingredientsLoading}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [seasonal, setSeasonal] = useState(false);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setSeasonal(product.seasonal);
  }, [product]);

  if (!product) return null;

  async function handleSave() {
    try {
      const body = {
        name: name.trim(),
        price: Number(price),
        category: category.trim(),
        seasonal: seasonal,
      };

      const res = await fetch(`${server}/api/menu/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Update failed");

      onSave({
        ...product,
        ...body,
        name,
        category,
        seasonal,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update item");
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`${server}/api/menu/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      onSave({ ...product, _deleted: true });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <TextField
              label="Category"
              fullWidth
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={seasonal}
                  onChange={e => setSeasonal(e.target.checked)}
                />
              }
              label={seasonal ? "Seasonal" : "Regular"}
            />
          </Stack>

          <Stack spacing={1}>
            <strong>Ingredients in this drink</strong>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell width={100}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredientsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading ingredients...
                    </TableCell>
                  </TableRow>
                ) : itemIngredients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No ingredients yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  itemIngredients.map(ing => (
                    <TableRow key={ing.id}>
                      <TableCell>{ing.id}</TableCell>
                      <TableCell>{ing.name ?? "Unnamed"}</TableCell>
                      <TableCell>{ing.category ?? "—"}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onRemoveIngredient(ing.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Stack>

          <Stack spacing={1}>
            <strong>All ingredients</strong>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell width={100}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allIngredients.map(ing => (
                  <TableRow key={ing.id}>
                    <TableCell>{ing.id}</TableCell>
                    <TableCell>{ing.name}</TableCell>
                    <TableCell>{ing.category}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onAddIngredient(ing.id)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
