import User from "../models/user.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import Doctor from "../models/doctor.model.js";

// update user role (Admin only)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // Validate role
  const validRoles = ["patient", "doctor", "admin"];
  if (!validRoles.includes(role)) {
    throw new AppError("Invalid role", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const previousRole = user.role;

  user.role = role;
  await user.save();

  // If role is doctor, ensure doctor profile exists
  if (role === "doctor") {
    const existingDoctor = await Doctor.findOne({ user: user._id });

    if (!existingDoctor) {
      await Doctor.create({
        user: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        specialization: "General",
        availability: "available",
      });
    }
  }

  // If role changed FROM doctor to something else, remove doctor profile
  if (previousRole === "doctor" && role !== "doctor") {
    await Doctor.findOneAndDelete({ user: user._id });
  }

  const updatedUser = await User.findById(id).select("-password");

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});

// ==== Get all users (Admin only) ====
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    data: users,
  });
});

// Get Stats
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDoctors = await User.countDocuments({ role: "doctor" });
  const totalPatients = await User.countDocuments({ role: "patient" });

  const Appointment = (await import("../models/appointment.model.js")).default;
  const totalAppointments = await Appointment.countDocuments();

  res.status(200).json({
    data: {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
    },
  });
});