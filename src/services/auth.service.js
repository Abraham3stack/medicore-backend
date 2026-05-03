import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import AppError from "../../utils/errors.js";
import jwt from "jsonwebtoken";

// ===== Login logic =====
export const loginUserService = async (email, password) => {
  // check if user exists
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Remove password from response
  user.password = undefined;

  return { user, token };
}

// ===== Register logic =====
export const registerUserService = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role
  } = userData;

  // Check if user exists
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

  // Create patient profile if needed
  if (user.role === "patient") {
    await Patient.create({
      user: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: new Date(),
      gender: "other",
    });
  }

  // Generate token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.password = undefined;

  return { user, token };
};