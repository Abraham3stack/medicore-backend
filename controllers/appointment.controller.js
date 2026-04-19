import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";
import Patient from "../models/patient.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// ==== Create appointment controller ====
export const createAppointment = asyncHandler(async (req, res) => {
  const {
    doctor, 
    appointmentDate,
    reason
  } = req.body;

  // Check if all required fields are provided
  if (!doctor || !appointmentDate) {
    throw new AppError("Doctor and appointment date are required", 400);
  }

  // Get patient linked to logged-in user
  const existingPatient = await Patient.findOne({ user: req.user.id });

  if (!existingPatient) {
    throw new AppError("Patient not found", 404);
  }

  const patient = existingPatient._id;

  // Validate ObjectId format(checks if doctor is valid)
  if (!mongoose.Types.ObjectId.isValid(doctor)) {
    throw new AppError("Invalid doctor ID", 400);
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

// ==== Get all appointments ====
export const getAppointments = asyncHandler(async (req, res) => {

  // Search appointments
  const { status, date } = req.query;

  let query = {};

  if (req.user.role === "patient") {

    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      throw new AppError("Patient not found", 404);
    }

    query.patient = patient._id;
  }

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

// ==== Get single appointment ====
export const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await Appointment.findById(id)
    .populate("patient", "firstName lastName")
    .populate("doctor", "firstName lastName specialization");

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// ==== Update appointment ====
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

// ==== Delete appointment ====
export const deleteAppointment = asyncHandler(async (req, res) => {

  // Validate objectId for delete
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid appointment ID", 400);
  }

  const appointment = await Appointment.findByIdAndDelete(req.params.id);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  // Make doctor available again
  await Doctor.findByIdAndUpdate(appointment.doctor, {
    availability: "available",
  });

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});