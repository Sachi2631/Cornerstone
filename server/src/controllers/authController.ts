import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthedRequest } from "../middleware/requireAuth";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

export const signup: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, lastName, email, password: hashed, createdAt: new Date(),
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    return;
  }
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user: any = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    return;
  }
};

export const me: RequestHandler = async (req, res) => {
  const u = { ...(req as AuthedRequest).user };
  delete (u as any)?.password;
  res.status(200).json({ user: u });
  return;
};

export const changePassword: RequestHandler = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user: any = await User.findById((req as AuthedRequest).user?._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      res.status(401).json({ message: "Current password is incorrect" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password updated" });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    return;
  }
};
