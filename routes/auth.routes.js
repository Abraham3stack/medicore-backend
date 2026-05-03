import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../src/validations/auth.validation.js";

const router = express.Router();

// Register route
router.post("/register", validate(registerSchema), registerUser);

// Login route
router.post("/login", validate(loginSchema), loginUser);

export default router;