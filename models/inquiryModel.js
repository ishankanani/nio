// backend/models/inquiryModel.js
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  name: String,
  contact: String,
  message: String,
  productName: String,
  productPrice: Number,
  productLink: String,
  userId: String,
  seen: { type: Boolean, default: false }
}, { timestamps: true });

const InquiryModel = mongoose.models.inquiry || mongoose.model("inquiry", inquirySchema);
export default InquiryModel;
