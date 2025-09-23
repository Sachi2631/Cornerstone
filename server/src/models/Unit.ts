import { Schema, model, Types } from "mongoose";

const UnitSchema = new Schema(
  {
    title: { type: String, required: true },
    prefectureCode: { type: String },
    lessonIds: [{ type: Types.ObjectId, ref: "Lesson" }],
    // optional: store final quiz as array of step "data" blobs
    finalQuiz: [{ type: Schema.Types.Mixed }]
  },
  { timestamps: true }
);

export const Unit = model("Unit", UnitSchema);
