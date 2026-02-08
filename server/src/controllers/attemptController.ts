import { RequestHandler } from "express";
import { Attempt } from "../models/Attempt";
import { ReviewItem } from "../models/ReviewItem";
import { AuthedRequest } from "../middleware/requireAuth";

export const createAttempt: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const authed = req as AuthedRequest;
    const userId = authed.user?._id;

    if (!userId) {
      console.warn(`[ATTEMPT][${rid}] Unauthorized: missing req.user`);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { lessonId, stepIndex, result, detail } = (req.body || {}) as {
      lessonId: string;
      stepIndex: number;
      result: "correct" | "incorrect";
      detail?: any;
    };

    if (!lessonId || typeof stepIndex !== "number" || !["correct", "incorrect"].includes(result)) {
      console.warn(`[ATTEMPT][${rid}] Invalid payload`, {
        lessonId,
        stepIndexType: typeof stepIndex,
        result,
      });
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const attempt = await Attempt.create({
      userId,   // ObjectId (user)
      lessonId, // string (slug or lesson key)
      stepIndex,
      result,
      detail,
    });

    console.log(`[ATTEMPT][${rid}] created`, {
      attemptId: attempt._id.toString(),
      userId: userId.toString?.() ?? String(userId),
      lessonId,
      stepIndex,
      result,
    });

    // spaced repetition update
    const review = await ReviewItem.findOneAndUpdate(
      { userId, lessonId, stepIndex },
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
    return;
  } catch (err: any) {
    console.error(`[ATTEMPT][${rid}] error`, err?.message || err);
    res.status(500).json({ error: "Internal error", details: err?.message || String(err) });
    return;
  }
};
