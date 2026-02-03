import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import fs from "fs/promises";

/* -------------------------------------------------------------------------- */
/* 🧠 SIMPLE IN-MEMORY CACHE (FOR LIST PRODUCTS) */
/* -------------------------------------------------------------------------- */
let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

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
      weight,
    } = req.body;

    const files = req.files?.images || [];

    if (!files.length) {
      return res.json({
        success: false,
        message: "Please upload at least one product image.",
      });
    }

    /* -------------------- UPLOAD IMAGES -------------------- */
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path);
        try {
          await fs.unlink(file.path);
        } catch {}
        return upload.secure_url;
      })
    );

    /* -------------------- SAFE FABRIC PARSE -------------------- */
    let parsedFabric = { top: [], bottom: [], dupatta: [] };

    try {
      if (fabric) {
        const temp = JSON.parse(fabric);
        parsedFabric = {
          top: Array.isArray(temp.top) ? temp.top : [],
          bottom: Array.isArray(temp.bottom) ? temp.bottom : [],
          dupatta: Array.isArray(temp.dupatta) ? temp.dupatta : [],
        };
      }
    } catch (err) {
      console.error("Fabric parse error (ADD):", err);
    }

    /* -------------------- CREATE PRODUCT -------------------- */
    const productData = {
      name,
      code: productCode || "",
      description,
      price: Number(price),
      moq: moq || "",
      weight: weight || "",
      category,
      subCategory,
      bestseller: bestseller === "true" || bestseller === true,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      fabric: parsedFabric,
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    cachedProducts = null; // 🔄 clear cache

    res.json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("addProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
      weight,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    /* -------------------- SAFE FABRIC PARSE -------------------- */
    let parsedFabric = { top: [], bottom: [], dupatta: [] };

    try {
      if (fabric) {
        const temp = JSON.parse(fabric);
        parsedFabric = {
          top: Array.isArray(temp.top) ? temp.top : [],
          bottom: Array.isArray(temp.bottom) ? temp.bottom : [],
          dupatta: Array.isArray(temp.dupatta) ? temp.dupatta : [],
        };
      }
    } catch (err) {
      console.error("Fabric parse error (UPDATE):", err);
    }

    /* -------------------- UPDATE FIELDS -------------------- */
    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.category = category;
    product.subCategory = subCategory;
    product.code = productCode || "";
    product.moq = moq || "";
    product.weight = weight || "";
    product.bestseller = bestseller === "true" || bestseller === true;
    product.sizes = sizes ? JSON.parse(sizes) : [];
    product.colors = colors ? JSON.parse(colors) : [];
    product.fabric = parsedFabric;

    /* -------------------- OPTIONAL IMAGE UPDATE -------------------- */
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
    cachedProducts = null; // 🔄 clear cache

    res.json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 LIST PRODUCTS (CACHED) */
/* -------------------------------------------------------------------------- */
export const listProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .sort({ date: -1 })
      .lean();

    res.json({ success: true, products });
  } catch (error) {
    console.error("listProducts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* -------------------------------------------------------------------------- */
/* 🟢 REMOVE PRODUCT */
/* -------------------------------------------------------------------------- */
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    cachedProducts = null;
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error("removeProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* -------------------------------------------------------------------------- */
/* 🟢 SINGLE PRODUCT */
/* -------------------------------------------------------------------------- */
export const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId).lean();
    res.json({ success: true, product });
  } catch (error) {
    console.error("singleProduct error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
