import Patient from "../models/patient.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// ==== Create patient ====
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);

  res.status(201).json({
    success: true,
    data: patient,
  });
});

// ==== Get all patients ====
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});

// ==== Get single patient ====
export const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid patient ID", 400);
  }

  const patient = await Patient.findById(id);

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// ==== Update patient ====
export const updatePatient = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid patient ID", 400);
  }

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// ==== Delete patient ====
export const deletePatient = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid patient ID", 400);
  }

  const patient = await Patient.findByIdAndDelete(req.params.id);

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Patient deleted successfully",
  });
});