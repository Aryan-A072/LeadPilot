
import mongoose from "mongoose";

const outreachDraftSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "approved", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OutreachDraft", outreachDraftSchema);