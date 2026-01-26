import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
  singleProductBySlug,
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

// Add product
router.post(
  "/add",
  upload.fields([{ name: "images", maxCount: 8 }]),
  addProduct
);

// Update product
router.put(
  "/update",
  upload.fields([{ name: "images", maxCount: 8 }]),
  updateProduct
);

// Get all products
router.get("/list", listProducts);

// ✅ NEW: Get product by slug
router.get("/slug/:slug", singleProductBySlug);

// OLD: Get product by ID (keep for backward compatibility)
router.post("/single", singleProduct);

// Delete product
router.post("/remove", removeProduct);

export default router;
