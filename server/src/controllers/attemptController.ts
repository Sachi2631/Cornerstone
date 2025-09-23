import { Response } from "express";
import { AuthedRequest } from "../middleware/requireAuth";
import { Attempt } from "../models/Attempt";
import { ReviewItem } from "../models/ReviewItem";

export const createAttempt = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { lessonId, stepIndex, result, detail } = req.body as {
      lessonId: string; stepIndex: number; result: "correct" | "incorrect"; detail?: any;
    };

    if (!lessonId || typeof stepIndex !== "number" || !["correct", "incorrect"].includes(result)) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const attempt = await Attempt.create({
      userId: req.user._id, // ObjectId (user)
      lessonId,             // string (slug)
      stepIndex,
      result,
      detail,
    });
    console.log("[ATTEMPT] created:", attempt._id.toString());

    // spaced repetition update
    const review = await ReviewItem.findOneAndUpdate(
      { userId: req.user._id, lessonId, stepIndex },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let ease = review.ease ?? 2.5;
    let intervalDays = review.intervalDays ?? 1;

    if (result === "correct") {
      ease = Math.max(1.3, ease + 0.1);
      intervalDays = Math.ceil(intervalDays * ease);
    } else {
      ease = Math.max(1.3, ease - 0.2);
      intervalDays = 1;
    }

    review.ease = ease;
    review.intervalDays = intervalDays;
    review.nextReviewAt = new Date(Date.now() + intervalDays * 24 * 3600 * 1000);
    await review.save();

    res.status(201).json({ ok: true, attemptId: attempt._id });
  } catch (err) {
    console.error("[ATTEMPT] error", err);
    res.status(500).json({ error: "Internal error" });
  }
};
