import { Response } from "express";
import { AuthedRequest } from "../middleware/requireAuth";
import { ReviewItem } from "../models/ReviewItem";

export const getReviewQueue = async (req: AuthedRequest, res: Response) => {
  if (!req.user?._id) {
    console.warn("[REVIEW] unauthorized");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const limit = Math.min(parseInt(String(req.query.limit ?? "20"), 10) || 20, 100);
  console.log("[REVIEW] queue for:", (req as any).__userEmail, "limit:", limit);

  const items = await ReviewItem.find({
    userId: req.user._id,
    nextReviewAt: { $lte: new Date() },
  }).sort({ nextReviewAt: 1 }).limit(limit).lean();

  console.log("[REVIEW] items:", items.length);
  res.json(items);
};
