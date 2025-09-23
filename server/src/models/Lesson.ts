import { Schema, model, Types } from "mongoose";

export type Step =
  | { type: "audioPlay"; audioUrl: string; prompt?: string }
  | { type: "recordRepeat"; targetText: string; minSec?: number }
  | { type: "dragDrop"; prompt: string; items: string[]; answer: string[] }
  | { type: "quizMCQ"; prompt: string; choices: string[]; answerIndex: number }
  | { type: "quizJudge"; prompt: string; correct: boolean }
  | { type: "fact"; text: string };

const StepSchema = new Schema(
  {
    type: { type: String, required: true },
    // store flexible payload in "data"
    data: { type: Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    unitId: { type: Types.ObjectId, ref: "Unit" },
    kind: { type: String, enum: ["character", "vocab", "listening", "mixed"], default: "mixed" },
    steps: { type: [StepSchema], default: [] },
    tags: { type: [String], default: [] },
    prefectureCode: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Lesson = model("Lesson", LessonSchema);
