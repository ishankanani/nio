import express from "express";
import multer from "multer";

import {
  addWatchBuy,
  listWatchBuy,
  updateWatchBuy,
  deleteWatchBuy,
} from "../controllers/watchBuyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/add", upload.single("video"), addWatchBuy);
router.get("/list", listWatchBuy);
router.put("/update/:id", updateWatchBuy);
router.delete("/delete/:id", deleteWatchBuy);

export default router;
