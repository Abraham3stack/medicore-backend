import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// Create appointment controller
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    patient,
    doctor, 
    appointmentDate,
    reason
  } = req.body;

  // Check if all required fields are provided
  if (!patient || !doctor || !appointmentDate) {
    throw new AppError("Please provide all required fields", 400);
  }

  // Validate ObjectId format(checks if patient & doctor are valid)
  if (!mongoose.Types.ObjectId.isValid(patient)) {
    throw new AppError("Invalid patient ID", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    throw new AppError("Invalid doctor ID", 400);
  }

  // Check if patient exists
  const existingPatient = await Patient.findById(patient);
  if (!existingPatient) {
    throw new AppError("Patient not found", 404);
  }

  // Check if doctor exists
  const existingDoctor = await Doctor.findById(doctor);
  if (!existingDoctor) {
    throw new AppError("Doctor not found", 404);
  }

  const appointment = await Appointment.create({
    patient,
    doctor,
    appointmentDate,
    reason,
  });

  res.status(201).json({
    success: true,
    data: appointment,
  });
});

// Get all appointments
export const getAppointments = asyncHandler(async (req, res) => {

  // Search appointments
  const { status, date } = req.query;

  let query = {};

  if (status) {
    query.status = status;
  }

  if (date) {
    query.appointmentDate = {
      $gte: new Date(date),
      $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
    };
  }

  const appointments = await Appointment.find(query)
  .populate("patient", "firstName lastName")
  .populate("doctor", "firstName lastName specialization")
  .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// Update appointment
export const updateAppointment = asyncHandler(async (req, res) => {

  // Validate objectId for update
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after", runValidators: true }
  );

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// Delete appointment
export const deleteAppointment = asyncHandler(async (req, res) => {

  // Validate objectId for delete
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});