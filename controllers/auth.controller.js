import asyncHandler from "../middleware/async.middleware.js";
import Patient from "../models/patient.model.js";
import { loginSchema, registerSchema } from "../src/validations/auth.validation.js";
import { loginUserService, registerUserService } from "../src/services/auth.service.js";

// ==== Register user ====
export const registerUser = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error?.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })) || ["Invalid input"],
    });
  }

  const { user, token } = await registerUserService(req.body);

  res.status(201).json({
    success: true,
    data: { user, token },
  });
});

// ==== Login user ====
export const loginUser = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  // Validate input
  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error?.issues?.map((err) => ({
        field: err.path[0],
        message: err.message,
      })) || ["Invalid input"],
    });
  }

  // Extract data
  const { email, password } = req.body;

  // Call login service
  const { user, token } = await loginUserService(email, password);

  // send response
  res.status(200).json({
    success: true,
    data: { user, token },
  });
});