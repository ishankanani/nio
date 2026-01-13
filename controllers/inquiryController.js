import InquiryModel from "../models/inquiryModel.js";

/**
 * CREATE INQUIRY
 * Public / Website form
 */
export const createInquiry = async (req, res) => {
  try {
    const inquiry = await InquiryModel.create({
      name: req.body.name,
      contact: req.body.contact,
      productName: req.body.productName || "",
      message: req.body.message || "",
      status: "new",              // IMPORTANT
      seen: false,
      createdBy: req.user?.id || null, // optional (for future staff linking)
    });

    res.json({ success: true, inquiry });
  } catch (error) {
    console.error("createInquiry error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET INQUIRY LIST
 * Used by InquiryList.jsx
 * /api/inquiry/list?status=new&sort=latest
 */
export const getInquiryList = async (req, res) => {
  try {
    const { status, name, contact, sort } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (name) filter.name = new RegExp(name, "i");
    if (contact) filter.contact = new RegExp(contact, "i");

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "next") sortOption = { followUpDate: 1 };

    const inquiries = await InquiryModel.find(filter).sort(sortOption);

    res.json({ success: true, inquiries });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


/**
 * UPDATE INQUIRY STATUS
 * /api/inquiry/update/:id
 */
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    await InquiryModel.findByIdAndUpdate(id, {
      ...req.body, // allows status + followUpDate
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

/**
 * DASHBOARD STATS
 * /api/inquiry/stats
 */
export const getInquiryStats = async (req, res) => {
  try {
    const statuses = [
      "new",
      "prospect",
      "followup",
      "hot",
      "won",
      "lost",
    ];

    const stats = { total: 0 };

    for (const status of statuses) {
      const count = await InquiryModel.countDocuments({ status });
      stats[status] = count;
      stats.total += count;
    }

    res.json({ success: true, stats });
  } catch (error) {
    console.error("getInquiryStats error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * MARK AS SEEN (OPTIONAL)
 */
export const markSeen = async (req, res) => {
  try {
    const { id } = req.body;
    await InquiryModel.findByIdAndUpdate(id, { seen: true });

    res.json({ success: true, message: "Marked as seen" });
  } catch (error) {
    console.error("markSeen error:", error);
    res.json({ success: false, message: error.message });
  }
};
export const getTodayFollowUps = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const inquiries = await InquiryModel.find({
    followUpDate: { $gte: today, $lt: tomorrow },
  });

  res.json({ success: true, inquiries });
};

export const getPendingFollowUps = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inquiries = await InquiryModel.find({
    followUpDate: { $lt: today },
    status: { $ne: "won" },
  });

  res.json({ success: true, inquiries });
};
