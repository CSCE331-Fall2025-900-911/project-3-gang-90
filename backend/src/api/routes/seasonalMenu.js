import { Router } from "express";
import * as seasonalMenuController from "../controllers/seasonalMenu.js";

const router = Router();

router.get("/", seasonalMenuController.getSeasonalMenu);
router.post("/", seasonalMenuController.createSeasonalMenuItem);
router.patch("/:id/price", seasonalMenuController.updateSeasonalMenuPrice);
router.delete("/:id", seasonalMenuController.deleteSeasonalMenuItem);

export default router;