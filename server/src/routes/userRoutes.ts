import express from "express";
import { updateMe, deleteMe } from "../controllers/userController";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();

router.put("/me", requireAuth, updateMe);
router.delete("/me", requireAuth, deleteMe); 

export default router;
