// src/models/UserProgress.ts
import { Schema, model, InferSchemaType, HydratedDocument } from "mongoose";

const UserProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lessonId: {
      // store lesson slug here
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      required: true,
      default: "in_progress",
    },
    lastStep: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    accuracyPct: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export type UserProgressAttrs = InferSchemaType<typeof UserProgressSchema>;
export type UserProgressDoc = HydratedDocument<UserProgressAttrs>;

export const UserProgress = model<UserProgressAttrs>(
  "UserProgress",
  UserProgressSchema
);