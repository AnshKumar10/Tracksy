import { getUserById, getUsers } from "controllers/userControllers";
import { Router } from "express";
import { adminOnlyAccess, protect } from "middlewares/authMiddleware";

const router = Router();

router.get("/", protect, adminOnlyAccess, getUsers);

router.get("/:id", protect, getUserById);

export default router;
