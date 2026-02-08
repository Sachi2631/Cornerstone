// src/controllers/lessonController.ts
import { RequestHandler } from "express";
import { Lesson } from "../models/Lesson";

/**
 * NOTE:
 * - Typed as RequestHandler so Express router overload resolution works.
 * - Returns Promise<void> (no `return res.json(...)`), fixes TS2769.
 * - Adds more robust lookup + clearer debugging.
 *
 * Route compatibility:
 * - Your route uses `/:lessonId`. This controller tries:
 *   1) slug === lessonId
 *   2) lessonId === lessonId (if your schema has it)
 *   3) _id === lessonId (if lessonId is a Mongo ObjectId string)
 */

const isObjectId = (s: string) => /^[a-fA-F0-9]{24}$/.test(s);

export const getLessonById: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const { lessonId } = req.params;
    console.log(`[LESSON][${rid}] get`, {
      lessonId,
      auth: req.headers.authorization ? "YES" : "NO",
    });

    const query: any = { isActive: true, $or: [] as any[] };

    // 1) slug match (your schema has slug)
    query.$or.push({ slug: lessonId });

    // 2) legacy lessonId field match (your old controller used lessonId)
    query.$or.push({ lessonId });

    // 3) your new JSON uses "id" like "lesson_1_v1" — if you store it in `id`
    query.$or.push({ id: lessonId });

    // 4) allow Mongo _id lookup if the param is an ObjectId string
    if (isObjectId(lessonId)) query.$or.push({ _id: lessonId });

    const lesson = await Lesson.findOne(query).lean();

    if (!lesson) {
      console.warn(`[LESSON][${rid}] not found`, { lessonId, tried: query.$or });
      res.status(404).json({ error: "Lesson not found" });
      return;
    }

    res.status(200).json({ lesson });
    return;
  } catch (e: any) {
    console.error(`[LESSON][${rid}] get error:`, e?.message || e);
    res.status(500).json({ error: e?.message || "Server error" });
    return;
  }
};

export const createLesson: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    console.log(`[LESSON][${rid}] create payload keys:`, Object.keys(req.body || {}));

    // Accept either new schema "slug" OR legacy "lessonId"
    // (Your mongoose model requires slug + title)
    const slug = req.body?.slug;
    const title = req.body?.title;

    if (!slug) {
      console.warn(`[LESSON][${rid}] create missing slug`);
      res.status(400).json({ error: "slug is required" });
      return;
    }
    if (!title) {
      console.warn(`[LESSON][${rid}] create missing title`);
      res.status(400).json({ error: "title is required" });
      return;
    }

    const doc = await Lesson.create(req.body);
    res.status(201).json({ lesson: doc });
    return;
  } catch (e: any) {
    console.error(`[LESSON][${rid}] create error:`, e?.message || e);
    // surface mongoose validation errors if present
    res.status(500).json({
      error: e?.message || "Server error",
      details: e?.errors ? Object.keys(e.errors) : undefined,
    });
    return;
  }
};

export const updateLesson: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    console.log(`[LESSON][${rid}] update mongo id:`, req.params.id, "payload keys:", Object.keys(req.body || {}));

    const doc = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      console.warn(`[LESSON][${rid}] update not found:`, req.params.id);
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.status(200).json({ lesson: doc });
    return;
  } catch (e: any) {
    console.error(`[LESSON][${rid}] update error:`, e?.message || e);
    res.status(500).json({
      error: e?.message || "Server error",
      details: e?.errors ? Object.keys(e.errors) : undefined,
    });
    return;
  }
};
