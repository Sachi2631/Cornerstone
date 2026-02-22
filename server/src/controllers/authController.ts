import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { AuthedRequest } from "../middleware/requireAuth";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

const sanitizeUser = (u: any) => {
  if (!u) return u;
  const obj = typeof u.toObject === "function" ? u.toObject() : u;
  delete obj.password;
  return obj;
};

export const signup: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!email || !password) {
      console.warn(`[AUTH][${rid}] signup missing email/password`);
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      createdAt: new Date(),
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: sanitizeUser(user) });
    return;
  } catch (err: any) {
    console.error(`[AUTH][${rid}] signup error:`, err?.message || err);
    res.status(500).json({ message: "Server error", error: err?.message || String(err) });
    return;
  }
};

export const login: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn(`[AUTH][${rid}] login missing email/password`);
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

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
    res.status(200).json({ token, user: sanitizeUser(user) });
    return;
  } catch (err: any) {
    console.error(`[AUTH][${rid}] login error:`, err?.message || err);
    res.status(500).json({ message: "Server error", error: err?.message || String(err) });
    return;
  }
};

export const me: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    const user = (req as AuthedRequest).user;

    if (!user) {
      console.warn(`[AUTH][${rid}] /me req.user missing`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({ user: sanitizeUser(user) });
    return;
  } catch (err: any) {
    console.error(`[AUTH][${rid}] /me error:`, err?.message || err);
    res.status(500).json({ message: "Server error", error: err?.message || String(err) });
    return;
  }
};

export const changePassword: RequestHandler = async (req, res): Promise<void> => {
  const rid = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  try {
    const { currentPassword, newPassword } = req.body;

    const authed = req as AuthedRequest;
    const userId = authed.user?._id;

    if (!userId) {
      console.warn(`[AUTH][${rid}] changePassword missing req.user`);
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user: any = await User.findById(userId);
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
  } catch (err: any) {
    console.error(`[AUTH][${rid}] changePassword error:`, err?.message || err);
    res.status(500).json({ message: "Server error", error: err?.message || String(err) });
    return;
  }
};
