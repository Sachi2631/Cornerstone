import { Router } from "express";
import {
  listLessons,
  getLessonById,
  createLesson,
  updateLesson,
} from "../controllers/lessonController";

const router = Router();

// GET /api/lessons?prefecture=Hokkaido
router.get("/", listLessons);

// GET /api/lessons/:lessonId (slug or ObjectId)
router.get("/:lessonId", getLessonById);

// POST /api/lessons
router.post("/", createLesson);

// PATCH /api/lessons/:id (slug or ObjectId)
router.patch("/:id", updateLesson);

export default router;