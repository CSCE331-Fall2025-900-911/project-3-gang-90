import { Router } from "express";
import * as menuController from "../controllers/menu.js";

const router = Router();

// GET /api/menu — full menu
router.get("/", menuController.getMenu);

// GET /api/menu/active — only active items
router.get("/active", menuController.getActiveMenu);

// GET /api/menu/item-id?name=... — lookup id by name
router.get("/item-id", menuController.getItemIdByName);

// GET /api/menu/:id/ingredients — optional ?seasonal=true|false
router.get("/:id/ingredients", menuController.getItemIngredients);

// POST /api/menu — create new menu item
router.post("/", menuController.createMenuItem);

// POST /api/menu/:id/ingredients — add ingredient to item
router.post("/:id/ingredients", menuController.addIngredientToItem);

// DELETE /api/menu/:id/ingredients/:ingredientId — optional ?seasonal=true|false
router.delete("/:id/ingredients/:ingredientId", menuController.removeIngredientFromItem);

// PATCH /api/menu/:id/price — update price
router.patch("/:id/price", menuController.updateMenuPrice);

// DELETE /api/menu/:id — delete menu item
router.delete("/:id", menuController.deleteMenuItem);

// POST /api/menu/:id/retire — soft delete (is_active = false)
router.post("/:id/retire", menuController.retireMenuItem);

export default router;