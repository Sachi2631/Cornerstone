import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export interface AuthedRequest extends Request {
  user?: any; // ideally your User doc interface
}

export const requireAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hdr = req.headers.authorization || "";
    const [, token] = hdr.split(" ");
    if (!token) {
      res.status(401).json({ message: "Missing token" });
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId).lean();
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    (req as AuthedRequest).user = user;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
