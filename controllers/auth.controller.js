import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";
import Patient from "../models/patient.model.js";

// ==== Register user ====
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body; 

  // Check if email exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role ? role : "patient",
  });

  // Create patient profile if user is a patient
  if (user.role === "patient") {
    await Patient.create({
      user: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: new Date(), // temporary default
      gender: "other", // temporary default
    });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  user.password = undefined;

  res.status(201).json({
    success: true,
    data: { user, token },
  });
});

// ==== Login user ====
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d"}
  );

  // Remove password from response
  user.password = undefined;

  // send response
  res.status(200).json({
    success: true,
    data: { user, token },
  });
});