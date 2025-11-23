import { Router } from "express";
import * as transactionsController from "../controllers/transactions.js";

const router = Router();

router.get("/", transactionsController.listTransactions);
router.get("/count", transactionsController.countTransactions);
router.get("/by-time", transactionsController.getTransactionsByTime);
router.get("/:id", transactionsController.getTransactionById);
router.post("/", transactionsController.createTransactionWithItems);

export default router;