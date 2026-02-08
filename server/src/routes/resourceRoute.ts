import { Router } from "express";
import {
  getResources,
  getResourceCategories,
} from "../controllers/resourceController";

const router = Router();

// GET /api/resources?cat=All|News|...&q=search
router.get("/", getResources);

// GET /api/resources/categories
router.get("/categories", getResourceCategories);

export default router;
