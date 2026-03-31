import express from "express";
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", createPatient);

router.get("/", getPatients);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;