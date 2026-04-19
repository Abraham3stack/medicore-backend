import express from "express";
import { updateUserRole } from "../controllers/user.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Update user role (admin only)
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

export default router;
