import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String }, // new optional code
  description: { type: String, required: true },
  price: { type: Number, required: true },
  moq: { type: String, default: "" }, // new field
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },

  fabric: { type: [String], default: [] }, // ⭐ MULTIPLE FABRIC
  colors: { type: [String], default: [] }, // ⭐ MULTIPLE COLORS

  date: { type: Number, required: true }
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
