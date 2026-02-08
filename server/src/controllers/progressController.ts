// src/controllers/progressController.ts
import { RequestHandler } from "express";
import { UserProgress } from "../models/UserProgress";
import { Attempt } from "../models/Attempt";
import { AuthedRequest } from "../middleware/requireAuth";

export const upsertProgress: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const authed = req as AuthedRequest;
    const userId = authed.user?._id;

    if (!userId) {
      console.warn(`[PROGRESS][${rid}] unauthorized: missing req.user`);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { lessonId, status, lastStep, accuracyPct } = (req.body || {}) as {
      lessonId: string;
      status: "in_progress" | "completed";
      lastStep: number;
      accuracyPct?: number;
    };

    if (
      !lessonId ||
      typeof lastStep !== "number" ||
      !["in_progress", "completed"].includes(status)
    ) {
      console.warn(`[PROGRESS][${rid}] invalid payload`, {
        lessonId,
        status,
        lastStepType: typeof lastStep,
        accuracyPct,
      });
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    const doc = await UserProgress.findOneAndUpdate(
      { userId, lessonId },
      { status, lastStep, accuracyPct: accuracyPct ?? 0, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`[PROGRESS][${rid}] upserted`, {
      id: doc._id.toString(),
      lessonId: doc.lessonId,
      lastStep: doc.lastStep,
      status: doc.status,
      accuracyPct: doc.accuracyPct,
    });

    res.status(200).json(doc);
    return;
  } catch (err: any) {
    console.error(`[PROGRESS][${rid}] error`, err?.message || err);
    res.status(500).json({ error: "Internal error", details: err?.message || String(err) });
    return;
  }
};

export const getProgressSummary: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const authed = req as AuthedRequest;
    const userId = authed.user?._id;

    if (!userId) {
      console.warn(`[PROGRESS][${rid}] summary unauthorized: missing req.user`);
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [byLesson, counts] = await Promise.all([
      UserProgress.find({ userId }).lean(),
      Attempt.aggregate([
        { $match: { userId } },
        { $group: { _id: "$result", count: { $sum: 1 } } },
      ]),
    ]);

    const totals: Record<string, number> = { correct: 0, incorrect: 0 };
    for (const c of counts) totals[c._id] = c.count;

    res.status(200).json({ lessons: byLesson, totals });
    return;
  } catch (err: any) {
    console.error(`[PROGRESS][${rid}] summary error`, err?.message || err);
    res.status(500).json({ error: "Internal error", details: err?.message || String(err) });
    return;
  }
};
