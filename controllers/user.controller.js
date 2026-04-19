import User from "../models/user.model.js";
import asyncHandler from "../middleware/async.middleware.js";
import AppError from "../utils/errors.js";

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

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});