import { Response } from "express";
import { AuthedRequest } from "../middleware/requireAuth";
import { Lesson } from "../models/Lesson";

export const getLessonBySlug = async (req: AuthedRequest, res: Response) => {
  const { slug } = req.params;
  console.log("[LESSON] get by slug:", slug, "user:", (req as any).__userEmail);
  const lesson = await Lesson.findOne({ slug, isActive: true });
  if (!lesson) {
    console.warn("[LESSON] not found:", slug);
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  res.json(lesson);
};

export const createLesson = async (req: AuthedRequest, res: Response) => {
  console.log("[LESSON] create payload:", req.body);
  const doc = await Lesson.create(req.body);
  res.status(201).json(doc);
};

export const updateLesson = async (req: AuthedRequest, res: Response) => {
  console.log("[LESSON] update id:", req.params.id, "payload:", req.body);
  const doc = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) {
    console.warn("[LESSON] update not found:", req.params.id);
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(doc);
};
