import { Router } from "express";
import { signup, login, me, changePassword } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// quick probe to verify token
router.get("/me", requireAuth, me);

router.post("/change-password", requireAuth, changePassword);

export default router;
