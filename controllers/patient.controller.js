import Patient from "../models/patient.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// Create patient controller
export const createPatient = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phone,
  } = req.body;

  if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
    throw new AppError("Please provide all required fields", 400);
  }

  const patient = await Patient.create(req.body);

  res.status(201).json({
    success: true,
    data: patient,
  });
});

// Get all patients controller
export const getPatients = asyncHandler(async (req, res) => {

  // Search patients
  const { search } = req.query;

  let query = {};

  if (search) {
    query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    };
  }
  
  const patients = await Patient.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: patients.length,
    data: patients,
  });
});

// Update patient
export const updatePatient = asyncHandler(async (req, res) => {

  // Validate objectId for update
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid patient ID", 400);
  }

  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after", runValidators: true }
  );

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: patient,
  });
});

// Delete patient
export const deletePatient = asyncHandler(async (req, res) => {

  // Validate objectId for delete
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