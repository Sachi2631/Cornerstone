import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export interface AuthedUser { _id: string; email?: string; role?: string; }
export interface AuthedRequest extends Request { user?: AuthedUser; }

export const requireAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hdr = req.headers.authorization || "";
    const [scheme, token] = hdr.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      console.warn("[AUTH] missing/invalid Authorization header");
      res.status(401).json({ message: "Missing or invalid Authorization header" });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      console.warn("[AUTH] user not found for token");
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    (req as AuthedRequest).user = { _id: String(user._id), email: user.email, role: (user as any).role };
    (req as any).__userEmail = user.email;
    console.log("[AUTH] ok for", user.email);
    next();
  } catch (e) {
    console.warn("[AUTH] verify error:", (e as Error).message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
