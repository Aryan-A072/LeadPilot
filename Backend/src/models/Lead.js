
import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema(
  {
    criterion: { type: String, required: true },
    weight: { type: Number, required: true },
    status: {
      type: String,
      enum: ["match", "mismatch", "unknown"],
      required: true,
    },
    evidence: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { _id: false }
);

const qualificationSchema = new mongoose.Schema(
  {
    confirmedScore: { type: Number, required: true },
    evidenceCoverage: { type: Number, required: true },
    qualificationStatus: { type: String, required: true },
    breakdown: [breakdownSchema],
    missingEvidence: [String],
    scoringNote: String,
    assessedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    employeeCount: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "employeeCount must be an integer",
      },
    },
    supportAutomationNeed: Boolean,
    hasRelevantContact: Boolean,
    qualification: qualificationSchema,
  },
  { timestamps: true }
);

leadSchema.index({ industry: 1 });
leadSchema.index({ "qualification.confirmedScore": -1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;