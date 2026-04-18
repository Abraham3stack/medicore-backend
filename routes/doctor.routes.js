import express from "express";
import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
} from "../controllers/doctor.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createDoctor);

router.get("/", protect, authorize("admin", "doctor", "patient"), getDoctors);

router.get("/:id", protect, authorize("admin", "doctor", "patient"), getDoctorById);

router.put("/:id", protect, authorize("admin"), updateDoctor);

router.delete("/:id", protect, authorize("admin"), deleteDoctor);

export default router;