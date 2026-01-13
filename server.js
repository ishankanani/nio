import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import inquiryRouter from "./routes/inquiryRoute.js";

/* -------------------------------------------------------------------------- */
/* 🔹 ENV SETUP */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/* 🔹 APP INIT */
/* -------------------------------------------------------------------------- */
const app = express();
const PORT = process.env.PORT || 4000; // ✅ local port

/* -------------------------------------------------------------------------- */
/* 🔹 CONNECT SERVICES (RUN ONCE) */
/* -------------------------------------------------------------------------- */
connectDB();
connectCloudinary();

/* -------------------------------------------------------------------------- */
/* 🔹 MIDDLEWARES */
/* -------------------------------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Vite local frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
