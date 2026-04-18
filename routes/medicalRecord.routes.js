import express from "express";

import {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordById,
} from "../controllers/medicalRecord.controller.js"; 
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("doctor"), createMedicalRecord);

router.get("/", protect, authorize("admin", "doctor"), getMedicalRecords);

router.get("/:id", protect, authorize("admin", "doctor"), getMedicalRecordById);

router.put("/:id", protect, authorize("doctor"), updateMedicalRecord);

router.delete("/:id", protect, authorize("admin"), deleteMedicalRecord);

export default router;