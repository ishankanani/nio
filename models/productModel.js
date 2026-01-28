import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    moq: { type: String, default: "" },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean, default: false },
    weight: { type: String, default: "" }, // e.g. "450g", "1.2kg"
    fabric: {
      top: { type: [String], default: [] },
      bottom: { type: [String], default: [] },
      dupatta: { type: [String], default: [] },
    },
    colors: { type: [String], default: [] },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

// 🔥 INDEXES
productSchema.index({ date: -1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ bestseller: 1 });

// ✅ SAFE DEFAULT EXPORT (prevents overwrite errors)
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
