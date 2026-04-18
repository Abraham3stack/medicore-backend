import Doctor from "../models/doctor.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import mongoose from "mongoose";

// ==== Create Doctor Controller ====
export const createDoctor = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    specialization,
    phone
  } = req.body;

  if (!firstName || !lastName || !specialization || !phone) {
    throw new AppError("Please provide all required fields", 400);
  }

  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    data: doctor,
  });
});

// ==== Get all doctors Contoller ====
export const getDoctors = asyncHandler(async (req, res) => {

  // Search doctors
  const { specialization, search, availability } = req.query;

  let query = {};

  if (specialization) {
    query.specialization = { $regex: specialization, $options: "i"}
  }

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  if (availability) {
    query.availability = availability;
  }

  const doctors = await Doctor.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// ==== Get single doctor ====
export const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid doctor ID", 400);
  }

  const doctor = await Doctor.findById(id);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// ==== Update Doctor ====
export const updateDoctor = asyncHandler(async (req, res) => {

  // Validate objectId for update
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid doctor ID", 400);
  }
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: "after", runValidators: true }
  );

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// ==== Delete Doctor ====
export const deleteDoctor = asyncHandler(async (req, res) => {

  // Validate objectId for delete
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid doctor ID", 400);
  }
  
  const doctor = await Doctor.findByIdAndDelete(req.params.id);

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Doctor deleted successfully",
  });
});