import { Router } from "express";
import * as employeeController from "../controllers/employees.js";

const router = Router();

router.get("/", employeeController.getAllEmployees);
router.get("/managers", employeeController.getManagers);
router.get("/count", employeeController.countActiveEmployees);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;