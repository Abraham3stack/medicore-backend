import express from "express";

import {
  createMedicalRecord,
  getMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
} from "../controllers/medicalRecord.controller.js"; 

const router = express.Router();

router.post("/", createMedicalRecord);

router.get("/", getMedicalRecords);

router.put("/:id", updateMedicalRecord);

router.delete("/:id", deleteMedicalRecord);

export default router;