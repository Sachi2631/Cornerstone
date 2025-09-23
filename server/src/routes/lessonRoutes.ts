import { Router } from "express";
import { getLessonBySlug, createLesson, updateLesson } from "../controllers/lessonController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/:slug", requireAuth, getLessonBySlug);

// (optional admin)
router.post("/", requireAuth, createLesson);
router.patch("/:id", requireAuth, updateLesson);

export default router;
