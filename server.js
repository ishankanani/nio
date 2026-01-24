import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import inquiryRouter from "./routes/inquiryRoute.js";
import watchBuyRoute from "./routes/watchBuyRoute.js";

/* -------------------------------------------------------------------------- */
/* 🔹 ENV SETUP */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/* 🔹 APP INIT */
/* -------------------------------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 4000;

/* -------------------------------------------------------------------------- */
/* 🔹 CONNECT SERVICES */
/* -------------------------------------------------------------------------- */
connectDB();           // MongoDB
connectCloudinary();   // Cloudinary

/* -------------------------------------------------------------------------- */
/* 🔹 MIDDLEWARES */
/* -------------------------------------------------------------------------- */
app.use(express.json({ limit: "10mb" }));

/* -------------------------------------------------------------------------- */
/* 🔹 CORS (LIVE + LOCAL SAFE) */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      // Local development
      if (origin.startsWith("http://localhost:517")) {
        return callback(null, true);
      }

      // ✅ LIVE FRONTEND DOMAIN (CHANGE THIS)
      if (origin === "https://your-frontend-domain.com") {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/* 🔹 HEALTH CHECK */
/* -------------------------------------------------------------------------- */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* -------------------------------------------------------------------------- */
/* 🔹 API ROUTES */
/* -------------------------------------------------------------------------- */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/watch-buy", watchBuyRoute);

/* -------------------------------------------------------------------------- */
/* 🔹 ROOT ROUTE */
/* -------------------------------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("API Working");
});

/* -------------------------------------------------------------------------- */
/* 🔹 START SERVER */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
