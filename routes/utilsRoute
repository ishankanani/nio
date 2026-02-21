import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/detect-country", async (req, res) => {
  try {
    // Get real IP (works on Render & proxies)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    // Use IP API from backend (no CORS problem)
    const response = await fetch(
      `http://ip-api.com/json/${ip}`
    );

    const data = await response.json();

    res.json({
      success: true,
      countryCode: data.countryCode || "IN",
    });

  } catch (error) {
    res.json({
      success: false,
      countryCode: "IN",
    });
  }
});

export default router;
