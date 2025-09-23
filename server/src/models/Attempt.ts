import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAttempt extends Document {
  userId: Types.ObjectId;
  lessonId: string; // <-- slug or string id
  stepIndex: number;
  result: "correct" | "incorrect";
  detail?: any;
  createdAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: String, required: true, index: true }, // <-- string
    stepIndex: { type: Number, required: true },
    result: { type: String, enum: ["correct", "incorrect"], required: true },
    detail: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

AttemptSchema.index({ userId: 1, lessonId: 1, stepIndex: 1, createdAt: -1 });

export const Attempt = mongoose.models.Attempt || mongoose.model<IAttempt>("Attempt", AttemptSchema);
