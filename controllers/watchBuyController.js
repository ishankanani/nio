import WatchBuy from "../models/watchBuyModel.js";
import cloudinary from "cloudinary";

export const addWatchBuy = async (req, res) => {
  try {
    const { title, productUrl, thumbnail, videoUrl } = req.body;
    let finalVideoUrl = videoUrl;

    // ✅ uploaded video
    if (req.file) {
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "watch-buy",
      });
      finalVideoUrl = upload.secure_url;
    }

    // ✅ validation
    if (!title || !finalVideoUrl || !productUrl) {
      return res.status(400).json({
        success: false,
        message: "Title, video and product link are required",
      });
    }

    const video = await WatchBuy.create({
      title,
      videoUrl: finalVideoUrl,
      productUrl,
      thumbnail,
    });

    res.json({ success: true, video });
  } catch (error) {
    console.error("WatchBuy Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listWatchBuy = async (req, res) => {
  const videos = await WatchBuy.find().sort({ createdAt: -1 });
  res.json({ success: true, videos });
};

export const updateWatchBuy = async (req, res) => {
  const updated = await WatchBuy.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ success: true, updated });
};

export const deleteWatchBuy = async (req, res) => {
  await WatchBuy.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
