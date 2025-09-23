import { Router } from "express";
import { getReviewQueue } from "../controllers/reviewController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.get("/queue", requireAuth, getReviewQueue);
export default router;
