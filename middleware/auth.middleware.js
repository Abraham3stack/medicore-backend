import jwt from "jsonwebtoken";
import asyncHandler from "./async.middleware.js";
import AppError from "../utils/errors.js";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Block access if no token
  if (!token) {
    throw new AppError("Not authorized, no token", 401);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attatch user info to request
  req.user = decoded;

  console.log("DECODED USER:", decoded);

  next();
});

// Role-Based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You are not authorized for this action", 403);
    }
    next();
  };
};