import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserProgress extends Document {
  userId: Types.ObjectId;
  lessonId: string; // <-- string
  status: "in_progress" | "completed";
  lastStep: number;
  accuracyPct?: number;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: String, required: true, index: true }, // <-- string
    status: { type: String, enum: ["in_progress", "completed"], required: true },
    lastStep: { type: Number, required: true },
    accuracyPct: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// one progress row per user+lesson
UserProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const UserProgress =
  mongoose.models.UserProgress || mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);
