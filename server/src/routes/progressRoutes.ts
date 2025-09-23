import { Router } from "express";
import { getProgressSummary, upsertProgress } from "../controllers/progressController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/summary", requireAuth, getProgressSummary);
router.patch("/", requireAuth, upsertProgress);

export default router;
