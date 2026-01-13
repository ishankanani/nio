import express from "express";
import {
  createInquiry,
  getInquiryList,
  updateInquiryStatus,
  getInquiryStats,
  getTodayFollowUps,
  getPendingFollowUps,
} from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/create", createInquiry);
router.get("/list", getInquiryList);
router.get("/stats", getInquiryStats);
router.put("/update/:id", updateInquiryStatus);

// FOLLOW-UP ROUTES (ADMIN PAGES)
router.get("/followup/today", getTodayFollowUps);
router.get("/followup/pending", getPendingFollowUps);

export default router;
