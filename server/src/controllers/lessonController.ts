import { Response } from "express";
import { AuthedRequest } from "../middleware/requireAuth";
import { Lesson } from "../models/Lesson";

export const getLessonById = async (req: AuthedRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    console.log("[LESSON] get by lessonId:", lessonId, "user:", (req as any).__userEmail);

    const lesson = await Lesson.findOne({ lessonId, isActive: true }).lean();
    if (!lesson) {
      console.warn("[LESSON] not found:", lessonId);
      res.status(404).json({ error: "Lesson not found" });
      return;
    }

    res.json({ lesson });
  } catch (e: any) {
    console.error("[LESSON] get error:", e);
    res.status(500).json({ error: e?.message || "Server error" });
  }
};

export const createLesson = async (req: AuthedRequest, res: Response) => {
  try {
    console.log("[LESSON] create payload:", req.body);

    if (!req.body?.lessonId) {
      res.status(400).json({ error: "lessonId is required" });
      return;
    }

    const doc = await Lesson.create(req.body);
    res.status(201).json({ lesson: doc });
  } catch (e: any) {
    console.error("[LESSON] create error:", e);
    res.status(500).json({ error: e?.message || "Server error" });
  }
};

export const updateLesson = async (req: AuthedRequest, res: Response) => {
  try {
    console.log("[LESSON] update mongo id:", req.params.id, "payload:", req.body);

    const doc = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      console.warn("[LESSON] update not found:", req.params.id);
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({ lesson: doc });
  } catch (e: any) {
    console.error("[LESSON] update error:", e);
    res.status(500).json({ error: e?.message || "Server error" });
  }
};
