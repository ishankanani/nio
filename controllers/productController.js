// backend/controllers/productController.js
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs/promises";

/* -------------------------------------------------------------------------- */
/* 🟢 ADD PRODUCT */
/* -------------------------------------------------------------------------- */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      productCode,
      colors,
      fabric,
      moq,
    } = req.body;

    const files = req.files?.images || [];

    if (!files.length) {
      return res.json({
        success: false,
        message: "Please upload at least one product image.",
      });
    }

    // Upload images
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path);
        try {
          await fs.unlink(file.path);
        } catch {}
        return upload.secure_url;
      })
    );

    const productData = {
      name,
      productCode: productCode || "",
      description,
      price: Number(price),
      moq: moq || "",
      category,
      subCategory,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      fabric: fabric ? JSON.parse(fabric) : [],
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("addProduct error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 UPDATE PRODUCT */
/* -------------------------------------------------------------------------- */
export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      productCode,
      colors,
      fabric,
      moq,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product)
      return res.json({ success: false, message: "Product not found" });

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.subCategory = subCategory;
    product.productCode = productCode || "";
    product.moq = moq || "";
    product.bestseller = bestseller === "true";

    product.sizes = sizes ? JSON.parse(sizes) : [];
    product.colors = colors ? JSON.parse(colors) : [];
    product.fabric = fabric ? JSON.parse(fabric) : [];

    // Image update
    if (req.files?.images?.length > 0) {
      const imageUrls = await Promise.all(
        req.files.images.map(async (file) => {
          const upload = await cloudinary.uploader.upload(file.path);
          try {
            await fs.unlink(file.path);
          } catch {}
          return upload.secure_url;
        })
      );

      product.image = imageUrls;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 LIST PRODUCTS */
/* -------------------------------------------------------------------------- */
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("listProducts error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 REMOVE PRODUCT */
/* -------------------------------------------------------------------------- */
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error("removeProduct error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 SINGLE PRODUCT DETAILS */
/* -------------------------------------------------------------------------- */
export const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    res.json({ success: true, product });
  } catch (error) {
    console.error("singleProduct error:", error);
    res.json({ success: false, message: error.message });
  }
};
