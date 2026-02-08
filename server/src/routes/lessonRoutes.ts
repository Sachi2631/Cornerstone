import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getLessonById, createLesson, updateLesson } from "../controllers/lessonController";

const router = Router();

router.get("/:lessonId", requireAuth, getLessonById);

// (optional admin)
router.post("/", requireAuth, createLesson);
router.patch("/:id", requireAuth, updateLesson);

export default router;
