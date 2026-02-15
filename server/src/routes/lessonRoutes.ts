// src/routes/lessonRoutes.ts
import { Router } from "express";
import { listLessons, getLessonById, createLesson, updateLesson } from "../controllers/lessonController";

const router = Router();

// Dashboard filter
router.get("/", listLessons);

// Lesson detail (slug)
router.get("/:lessonId", getLessonById);

// optional admin
router.post("/", createLesson);
router.patch("/:id", updateLesson);

export default router;
