// src/models/User.ts

import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Volunteer" | "Public";
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // prevents accidental exposure
    },
    role: {
      type: String,
      enum: ["Volunteer", "Public"],
      default: "Volunteer",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving
 */
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Compare password during login
 */
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

/**
 * Remove sensitive/internal fields when returning JSON
 */
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, __v, ...safe } = ret;
    return safe;
  },
});

export default mongoose.model<IUser>("User", UserSchema);