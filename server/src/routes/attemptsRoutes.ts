import { Router } from "express";
import { createAttempt } from "../controllers/attemptController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.post("/", requireAuth, createAttempt);
export default router;
