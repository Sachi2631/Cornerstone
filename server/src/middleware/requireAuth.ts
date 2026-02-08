import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthedRequest extends Express.Request {
  user?: any;
}

type JwtPayload = {
  userId?: string;
  id?: string;
  _id?: string;
  email?: string;
};

export const requireAuth: RequestHandler = async (req, res, next): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  (req as any).__rid = rid;

  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      console.warn(`[AUTH][${rid}] Missing/invalid Authorization header`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = auth.split(" ")[1];

    // IMPORTANT: must match authController default
    const secret = process.env.JWT_SECRET || "devsecret";

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch (e: any) {
      console.warn(`[AUTH][${rid}] jwt.verify failed:`, e?.message || e);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      console.warn(`[AUTH][${rid}] Token decoded but missing userId/id/_id`, decoded);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.warn(`[AUTH][${rid}] User not found for id=${userId}`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    (req as AuthedRequest).user = user;

    next();
    return;
  } catch (e: any) {
    console.error(`[AUTH][${rid}] requireAuth unexpected error:`, e?.message || e);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
