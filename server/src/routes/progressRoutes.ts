// src/routes/progressRoutes.ts
import { Router } from "express";
import {
  upsertProgress,
  getProgressSummary,
  getUpNextLesson,
} from "../controllers/progressController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/", requireAuth, upsertProgress);
router.get("/summary", requireAuth, getProgressSummary);
router.get("/up-next", requireAuth, getUpNextLesson);

export default router;