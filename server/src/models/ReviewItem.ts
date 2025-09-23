import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReviewItem extends Document {
  userId: Types.ObjectId;
  lessonId: string; // <-- string
  stepIndex: number;
  ease: number;
  intervalDays: number;
  nextReviewAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewItemSchema = new Schema<IReviewItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: String, required: true, index: true }, // <-- string
    stepIndex: { type: Number, required: true },
    ease: { type: Number, default: 2.5 },
    intervalDays: { type: Number, default: 1 },
    nextReviewAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true, versionKey: false }
);

// one spaced-rep item per (user, lesson, step)
ReviewItemSchema.index({ userId: 1, lessonId: 1, stepIndex: 1 }, { unique: true });

export const ReviewItem =
  mongoose.models.ReviewItem || mongoose.model<IReviewItem>("ReviewItem", ReviewItemSchema);
