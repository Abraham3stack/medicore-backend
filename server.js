import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import patientRoutes from "./routes/patient.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import medicalRecordRoutes from "./routes/medicalRecord.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

connectDB();

const app = express();

// Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15mins
  max: 100, // limit each IP
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// ==== Middleware ====
app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://medicore-frontend-omega.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// Rate limit
app.use("/api", limiter);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success:true,
    message: "Medicore API is running 🚀",
  });
});

// ==== Patient Routes ====
app.use("/api/patients", patientRoutes);

// ==== Doctor Routes ====
app.use("/api/doctors", doctorRoutes);

// ==== Appointment Routes ====
app.use("/api/appointments", appointmentRoutes);

// ==== Medical Record Routes ====
app.use("/api/medical-records", medicalRecordRoutes);

// ==== Use auth routes ====
app.use("/api/auth", authRoutes);

// ==== Admin user routes ====
app.use("/api/users", userRoutes);

// ==== 404 Route handler ====
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==== Error Middleware ====
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
