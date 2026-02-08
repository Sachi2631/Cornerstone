import { Schema, model } from "mongoose";

export type Exercise =
  | {
      exerciseId: string;
      type: "connectTheDots";
      items: string[]; // e.g. ["あ/ア", "い/イ"]
      correctAnswers: string[];
    }
  | {
      exerciseId: string;
      type: "matchAudioLetter";
      items: string[]; // e.g. ["あ/ア", "い/イ"]
      correctAnswers: string[];
      audioUrl?: string; // optional if you have it
      prompt?: string;
    }
  | {
      exerciseId: string;
      type: "vocabulary_drag_drop";
      characterBank: string[];
      correctAnswer: string; // e.g. "あい"
      prompt?: string;
    };

const ExerciseSchema = new Schema(
  {
    exerciseId: { type: String, required: true },
    type: { type: String, required: true },

    // connectTheDots / matchAudioLetter
    items: { type: [String], default: undefined },
    correctAnswers: { type: [String], default: undefined },

    // matchAudioLetter
    audioUrl: { type: String, default: undefined },
    prompt: { type: String, default: undefined },

    // vocabulary_drag_drop
    characterBank: { type: [String], default: undefined },
    correctAnswer: { type: String, default: undefined },
  },
  { _id: false }
);

const AchievementSchema = new Schema(
  {
    title: { type: String, default: "" },
    xp: { type: Number, default: 0 },
  },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    // Use your JSON `id` as primary lookup field
    lessonId: { type: String, required: true, unique: true, index: true }, // e.g. "lesson_1_v1"

    title: { type: String, required: true },
    version: { type: String, default: "" }, // e.g. "V1"

    flashcards: { type: [String], default: [] }, // e.g. ["あ/ア", "い/イ"]
    flashcardsCorrect: { type: String, default: "" }, // optional, for flips grading

    funFact: { type: String, default: "" },
    notes: { type: String, default: "" },

    exercises: { type: [ExerciseSchema], default: [] },

    achievement: { type: AchievementSchema, default: () => ({ title: "", xp: 0 }) },

    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Lesson = model("Lesson", LessonSchema);
