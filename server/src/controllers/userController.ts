// src/controllers/userController.ts
import { RequestHandler } from "express";
import User from "../models/user";
import { AuthedRequest } from "../middleware/requireAuth";

export const updateMe: RequestHandler = async (req, res) => {
  try {
    const authed = (req as AuthedRequest).user;
    if (!authed?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { firstName, lastName, email } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;

    // If you want to allow email changes, keep this block.
    if (email !== undefined) {
      const existing = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: authed._id } });
      if (existing) {
        res.status(409).json({ message: "Email already in use" });
        return;
      }
      updates.email = email.toLowerCase().trim();
    }

    const user = await User.findByIdAndUpdate(authed._id, updates, {
      new: true,
      runValidators: true,
      context: "query",
      select: "-password",
    }).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMe: RequestHandler = async (req, res) => {
  try {
    const authed = (req as AuthedRequest).user;
    if (!authed?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await User.findByIdAndDelete(authed._id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
