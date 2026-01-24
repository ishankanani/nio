import mongoose from "mongoose";

const watchBuySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
    productUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const WatchBuy =
  mongoose.models.watchbuy || mongoose.model("watchbuy", watchBuySchema);

export default WatchBuy;
