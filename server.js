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
connectDB();
connectCloudinary();

/* -------------------------------------------------------------------------- */
/* 🔹 CORS (CORRECT & SAFE) */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      // allow all Vite dev ports
      if (origin.startsWith("http://localhost:517")) {
        return callback(null, true);
      }

      // block others
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

/* -------------------------------------------------------------------------- */
/* 🔹 BODY PARSER */
/* -------------------------------------------------------------------------- */
app.use(express.json({ limit: "10mb" }));

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
  res.send("API Working (Local)");
});

/* -------------------------------------------------------------------------- */
/* 🔹 START SERVER */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Local server running on http://localhost:${PORT}`);
});
