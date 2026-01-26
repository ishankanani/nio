import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ---------------- BASIC INFO ----------------
    name: { type: String, required: true },

    // ✅ SEO FRIENDLY URL SLUG
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    code: { type: String },

    // ---------------- DETAILS ----------------
    description: { type: String, required: true },
    price: { type: Number, required: true },
    moq: { type: String, default: "" },

    // ---------------- MEDIA ----------------
    image: { type: Array, required: true },

    // ---------------- CATEGORIZATION ----------------
    category: { type: String, required: true },
    subCategory: { type: String, required: true },

    // ---------------- OPTIONS ----------------
    sizes: { type: Array, required: true },
    fabric: { type: [String], default: [] },
    colors: { type: [String], default: [] },

    // ---------------- FLAGS ----------------
    bestseller: { type: Boolean, default: false },

    // ---------------- META ----------------
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

// 🔥 INDEXES (KEEPING ALL + ADDING SLUG)
productSchema.index({ slug: 1 });
productSchema.index({ date: -1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ bestseller: 1 });

// ✅ SAFE DEFAULT EXPORT (prevents overwrite errors in dev)
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
