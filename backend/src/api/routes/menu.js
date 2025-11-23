import { Router } from "express";
import * as menuController from "../controllers/menu.js";

const router = Router();

router.get("/", menuController.getMenu);
router.get("/active", menuController.getActiveMenu);
router.get("/item-id", menuController.getItemIdByName);
router.get("/:id/ingredients", menuController.getItemIngredients);
router.post("/", menuController.createMenuItem);
router.post("/:id/ingredients", menuController.addIngredientToItem);
router.delete("/:id/ingredients/:ingredientId", menuController.removeIngredientFromItem);
router.patch("/:id/price", menuController.updateMenuPrice);
router.delete("/:id", menuController.deleteMenuItem);
router.post("/:id/retire", menuController.retireMenuItem);

export default router;