// backend/controllers/inquiryController.js
import InquiryModel from "../models/inquiryModel.js";

// Create inquiry
export const createInquiry = async (req, res) => {
  try {
    const inquiry = await InquiryModel.create(req.body);
    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("createInquiry error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Get all inquiries (admin)
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await InquiryModel.find().sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (error) {
    console.error("getAllInquiries error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Mark as seen
export const markSeen = async (req, res) => {
  try {
    const { id } = req.body;
    await InquiryModel.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true, message: "Marked as Seen" });
  } catch (error) {
    console.error("markSeen error:", error);
    res.json({ success: false, message: error.message });
  }
};
