import { z } from "zod";

// Login Validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be atleast 6 characters"}),
});

// Register Validation
export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be atleast 2 characters"),
  lastName: z.string().min(2, "Last name must be atleats 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  role: z.enum(["patient", "doctor", "admin"]).optional(),
});