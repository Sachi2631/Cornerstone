import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getLessonById, createLesson, updateLesson } from "../controllers/lessonController";

const router = Router();

router.get("/:lessonId", getLessonById);

// (optional admin)
router.post("/", createLesson);
router.patch("/:id", updateLesson);

export default router;
