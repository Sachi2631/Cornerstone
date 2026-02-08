// src/controllers/reviewController.ts
import { RequestHandler } from "express";
import { ReviewItem } from "../models/ReviewItem";
import { AuthedRequest } from "../middleware/requireAuth";

export const getReviewQueue: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const authed = req as AuthedRequest;
    const userId = authed.user?._id;

    if (!userId) {
      console.warn(`[REVIEW][${rid}] unauthorized: missing req.user`);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const limitRaw = String(req.query.limit ?? "20");
    const limit = Math.min(parseInt(limitRaw, 10) || 20, 100);

    console.log(`[REVIEW][${rid}] queue`, {
      userId: userId.toString?.() ?? String(userId),
      limit,
    });

    const items = await ReviewItem.find({
      userId,
      nextReviewAt: { $lte: new Date() },
    })
      .sort({ nextReviewAt: 1 })
      .limit(limit)
      .lean();

    console.log(`[REVIEW][${rid}] items`, { count: items.length });
    res.status(200).json(items);
    return;
  } catch (err: any) {
    console.error(`[REVIEW][${rid}] error`, err?.message || err);
    res.status(500).json({ error: "Internal error", details: err?.message || String(err) });
    return;
  }
};
