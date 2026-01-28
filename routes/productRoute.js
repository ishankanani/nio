// backend/routes/productRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct
} from "../controllers/productController.js";

const router = express.Router();

// Temp upload folder for multer
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.join(__dirname, "../node_modules/.temp_uploads"),
});

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// Add product (supports multiple images)
router.post(
  "/add",
  upload.fields([{ name: "images", maxCount: 11 }]),
  addProduct
);

// Update product (Edit)
router.put(
  "/update",
  upload.fields([{ name: "images", maxCount: 11 }]),
  updateProduct
);

// Get all products
router.get("/list", listProducts);

// Get single product
router.post("/single", singleProduct);

// Delete product
router.post("/remove", removeProduct);

export default router;
