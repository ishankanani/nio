// backend/routes/inquiryRoute.js
import express from "express";
import { createInquiry, getAllInquiries, markSeen } from "../controllers/inquiryController.js";

const router = express.Router();

router.post("/create", createInquiry); // POST /api/inquiry/create
router.get("/all", getAllInquiries);   // GET  /api/inquiry/all
router.post("/seen", markSeen);        // POST /api/inquiry/seen

export default router;
