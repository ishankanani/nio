import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: String,
    contact: String,
    message: String,
    productName: String,
    productPrice: Number,
    productLink: String,

    status: {
      type: String,
      default: "new",
      enum: ["new", "prospect", "followup", "hot", "won", "lost"],
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.inquiry ||
  mongoose.model("inquiry", inquirySchema);
