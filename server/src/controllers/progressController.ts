import { Response } from "express";
import { AuthedRequest } from "../middleware/requireAuth";
import { UserProgress } from "../models/UserProgress";
import { Attempt } from "../models/Attempt";

export const upsertProgress = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { lessonId, status, lastStep, accuracyPct } = req.body as {
      lessonId: string; status: "in_progress" | "completed"; lastStep: number; accuracyPct?: number;
    };

    if (!lessonId || typeof lastStep !== "number" || !["in_progress", "completed"].includes(status)) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const doc = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, lessonId }, // lessonId is string
      { status, lastStep, accuracyPct: accuracyPct ?? 0, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log("[PROGRESS] upserted:", { id: doc._id.toString(), lessonId: doc.lessonId, lastStep: doc.lastStep });
    res.json(doc);
  } catch (err) {
    console.error("[PROGRESS] error", err);
    res.status(500).json({ error: "Internal error" });
  }
};

export const getProgressSummary = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [byLesson, counts] = await Promise.all([
      UserProgress.find({ userId: req.user._id }).lean(),
      Attempt.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: "$result", count: { $sum: 1 } } },
      ]),
    ]);

    const totals: Record<string, number> = { correct: 0, incorrect: 0 };
    for (const c of counts) totals[c._id] = c.count;

    res.json({ lessons: byLesson, totals });
  } catch (err) {
    console.error("[PROGRESS summary] error", err);
    res.status(500).json({ error: "Internal error" });
  }
};
