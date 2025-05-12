import {
  createTask,
  deleteTask,
  getDashboardReport,
  getTaskById,
  getTasks,
  getUserSpecificDashboardReport,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from "../controllers/taskControllers";
import { Router } from "express";
import { adminOnlyAccess, protect } from "../middlewares/authMiddleware";

const router = Router();

router.get("/dashboard-report", protect, getDashboardReport);

router.get("/user-dashboard-report", protect, getUserSpecificDashboardReport);

router.get("/", protect, getTasks);

router.get("/:id", protect, getTaskById);

router.post("/", protect, createTask);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, adminOnlyAccess, deleteTask);

router.put("/:id/status", protect, updateTaskStatus);

router.put("/:id/todo", protect, updateTaskChecklist);

export default router;
