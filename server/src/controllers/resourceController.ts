import { RequestHandler } from "express";
import { Resource } from "../models/Resource";

export const getResources: RequestHandler = async (req, res) => {
  try {
    const q = String(req.query.q ?? "").trim().toLowerCase();
    const cat = String(req.query.cat ?? "All").trim();

    const docs = await Resource.find(cat === "All" ? {} : { category: cat })
      .sort({ category: 1 })
      .lean();

    if (!q) {
      res.json(docs);
      return;
    }

    const filtered = docs
      .map((c: any) => ({
        ...c,
        items: (c.items ?? []).filter((it: any) => {
          const t = String(it.title ?? "").toLowerCase();
          const d = String(it.description ?? "").toLowerCase();
          return t.includes(q) || d.includes(q);
        }),
      }))
      .filter((c: any) => (c.items?.length ?? 0) > 0);

    res.json(filtered);
    return;
  } catch {
    res.status(500).json({ message: "Failed to fetch resources." });
    return;
  }
};

export const getResourceCategories: RequestHandler = async (_req, res) => {
  try {
    const cats = await Resource.find({}, { category: 1, _id: 0 })
      .sort({ category: 1 })
      .lean();

    const names = Array.from(new Set(cats.map((c: any) => c.category)));
    res.json(names);
    return;
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
    return;
  }
};
