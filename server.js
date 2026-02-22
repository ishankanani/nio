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
/* 🔹 IMPORTANT FOR RENDER (REAL IP FIX) */
/* -------------------------------------------------------------------------- */
app.set("trust proxy", 1);

/* -------------------------------------------------------------------------- */
/* 🔹 CONNECT SERVICES */
/* -------------------------------------------------------------------------- */
connectDB();
connectCloudinary();

/* -------------------------------------------------------------------------- */
/* 🔹 CORS CONFIGURATION (PRODUCTION READY) */
/* -------------------------------------------------------------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://nionatrendz.com",
  "https://www.nionatrendz.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests globally
app.options("*", cors());

/* -------------------------------------------------------------------------- */
/* 🔹 BODY PARSER */
/* -------------------------------------------------------------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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
/* 🔹 GLOBAL ERROR HANDLER */
/* -------------------------------------------------------------------------- */
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* -------------------------------------------------------------------------- */
/* 🔹 START SERVER */
/* -------------------------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
