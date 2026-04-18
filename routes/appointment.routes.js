import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
} from "../controllers/appointment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, authorize("patient"), createAppointment);

router.get("/", protect, authorize("admin", "doctor"), getAppointments);

router.get("/:id", protect, authorize("admin", "doctor"), getAppointmentById);

router.put("/:id", protect, authorize("admin"), updateAppointment);

router.delete("/:id", protect, authorize("admin"), deleteAppointment);

export default router;