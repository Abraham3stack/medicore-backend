import express from "express";
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
  getPatientById,
} from "../controllers/patient.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createPatient);

router.get("/", protect, authorize("admin", "doctor"), getPatients);

router.get("/:id", protect, authorize("admin", "doctor"), getPatientById);

router.put("/:id", protect, authorize("admin"), updatePatient);

router.delete("/:id", protect, authorize("admin"), deletePatient);

export default router;