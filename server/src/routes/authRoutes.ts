import express from "express";
import { signup, login, me, changePassword } from "../controllers/authController";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/change-password", requireAuth, changePassword);

export default router;
