import { Router } from "express";
import * as ingredientsController from "../controllers/ingredients.js";

const router = Router();

router.get("/", ingredientsController.getIngredients);
router.get("/id", ingredientsController.getIngredientIdByName);
router.post("/", ingredientsController.createIngredient);
router.patch("/:id", ingredientsController.updateIngredient);
router.delete("/:id", ingredientsController.deleteIngredient);
router.post("/refill", ingredientsController.refillInventory);
router.post("/:id/decrease", ingredientsController.decreaseInventory);
router.get("/usage", ingredientsController.getIngredientUsage);
router.get("/sales-report", ingredientsController.getSalesReport);

export default router;