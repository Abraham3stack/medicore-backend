import MedicalRecord from "../models/medicalRecord.model.js";
import Patient from "../models/patient.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// ==== Create medical record ====
export const createMedicalRecord = asyncHandler(async (req, res) => {
  const {
    patient,
    diagnosis,
    treatment,
    notes
  } = req.body;

  if (!patient || !diagnosis) {
    throw new AppError("Patient and diagnosis are required", 400);
  }

  // Validate objectId
  if (!mongoose.Types.ObjectId.isValid(patient)) {
    throw new AppError("Invalid patient ID", 400);
  }

  // Check if patient exists
  const existingPatient = await Patient.findById(patient);

  if (!existingPatient) {
    throw new AppError("Patient not found", 404);
  }

  const record = await MedicalRecord.create({
    patient,
    diagnosis,
    treatment,
    notes,
  });

  res.status(201).json({
    success: true,
    data: record,
  });
});

// ==== Get all medical records ====
export const getMedicalRecords = asyncHandler(async (req, res) => {

  // search medicalRecords
  const { patient } = req.query;

  let query = {};

  if (patient) {
    if (!mongoose.Types.ObjectId.isValid(patient)) {
      throw new AppError("Invalid patient ID", 400);
    }
    query.patient = patient;
  }

  const records = await MedicalRecord.find(query)
    .populate("patient", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

// ==== Get single medical record ====
export const getMedicalRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid record ID", 400);
  }

  const record = await MedicalRecord.findById(id).populate(
    "patient",
    "firstName lastName email"
  );

  if (!record) {
    throw new AppError("Medical record not found", 404);
  }

  res.status(200).json({
    success: true,
    data: record,
  });
});

// ==== Update medical record ====
export const updateMedicalRecord = asyncHandler(async (req, res) => {

  // Validate objectId for update
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid record ID", 400);
  }

  const record = await MedicalRecord.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after", runValidators: true }
  );

  if (!record) {
    throw new AppError("Medical record not found", 404);
  }

  res.status(200).json({
    success: true,
    data: record,
  });
});

// ==== Delete medical record ====
export const deleteMedicalRecord = asyncHandler(async (req, res) => {
  
  // Validate objectId for delete
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid record ID", 400);
  }

  const record = await MedicalRecord.findByIdAndDelete(req.params.id);

  if (!record) {
    throw new AppError("Medical record not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Medical record deleted successfully",
  });
});