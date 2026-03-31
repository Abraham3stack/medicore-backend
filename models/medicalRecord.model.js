import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },

    treatment: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    recordDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

export default MedicalRecord;