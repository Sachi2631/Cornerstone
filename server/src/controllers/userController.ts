import { RequestHandler } from "express";
import User from "../models/User";
import { AuthedRequest } from "../middleware/requireAuth";

export const updateMe: RequestHandler = async (req, res) => {
  try {
    const authed = (req as AuthedRequest).user;
    if (!authed?._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { firstName, lastName, email } = req.body;
    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email; // only if you allow email change

    const user = await User.findByIdAndUpdate(authed._id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    delete (user as any).password;
    res.status(200).json({ user });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    return;
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
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    return;
  }
};
