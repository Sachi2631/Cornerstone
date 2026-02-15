// src/models/Lesson.ts
import { Schema, model } from "mongoose";

export type PrefectureCode =
  | "Hokkaido" | "Aomori" | "Iwate" | "Miyagi" | "Akita" | "Yamagata" | "Fukushima"
  | "Ibaraki" | "Tochigi" | "Gunma" | "Saitama" | "Chiba" | "Tokyo" | "Kanagawa"
  | "Niigata" | "Toyama" | "Ishikawa" | "Fukui" | "Yamanashi" | "Nagano"
  | "Gifu" | "Shizuoka" | "Aichi" | "Mie"
  | "Shiga" | "Kyoto" | "Osaka" | "Hyogo" | "Nara" | "Wakayama"
  | "Tottori" | "Shimane" | "Okayama" | "Hiroshima" | "Yamaguchi"
  | "Tokushima" | "Kagawa" | "Ehime" | "Kochi"
  | "Fukuoka" | "Saga" | "Nagasaki" | "Kumamoto" | "Oita" | "Miyazaki" | "Kagoshima" | "Okinawa";

export type Exercise =
  | {
      exerciseId: string;
      type: "connectTheDots";
      items: string[];
      correctAnswers: string[];
      prompt?: string;
    }
  | {
      exerciseId: string;
      type: "matchAudioLetter";
      items: string[];
      correctAnswers: string[];
      audioUrl?: string;
      prompt?: string;
    }
  | {
      exerciseId: string;
      type: "vocabulary_drag_drop";
      characterBank: string[];
      correctAnswer: string;
      prompt?: string;
    };

const ExerciseSchema = new Schema({
  exerciseId: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["connectTheDots", "matchAudioLetter", "vocabulary_drag_drop"],
  },

  items: { type: [String], default: undefined },
  correctAnswers: { type: [String], default: undefined },

  audioUrl: { type: String, default: undefined },
  prompt: { type: String, default: undefined },

  characterBank: { type: [String], default: undefined },
  correctAnswer: { type: String, default: undefined },
}); // ✅ has _id per exercise

const AchievementSchema = new Schema(
  { title: { type: String, default: "" }, xp: { type: Number, default: 0 } },
  { _id: false }
);

const LessonSchema = new Schema(
  {
    // ✅ you switched to slug-based ids
    slug: { type: String, required: true, unique: true, index: true }, // "hiragana-l1-v1"

    title: { type: String, required: true },
    version: { type: String, default: "V1" },

    flashcards: { type: [String], default: [] },
    funFact: { type: String, default: "" },
    notes: { type: String, default: "" },

    exercises: { type: [ExerciseSchema], default: [] },
    achievement: { type: AchievementSchema, default: () => ({ title: "", xp: 0 }) },

    // ✅ prefecture stored in DB (required for dashboard filter)
    prefecture: {
      type: String,
      required: true,
      index: true,
      // optional enum validation (keeps DB clean)
      enum: [
        "Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima",
        "Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tokyo","Kanagawa",
        "Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano",
        "Gifu","Shizuoka","Aichi","Mie",
        "Shiga","Kyoto","Osaka","Hyogo","Nara","Wakayama",
        "Tottori","Shimane","Okayama","Hiroshima","Yamaguchi",
        "Tokushima","Kagawa","Ehime","Kochi",
        "Fukuoka","Saga","Nagasaki","Kumamoto","Oita","Miyazaki","Kagoshima","Okinawa"
      ],
    },

    isActive: { type: Boolean, default: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

LessonSchema.path("exercises").validate(function (arr: any[]) {
  const ids = (arr || []).map((x) => x.exerciseId);
  return ids.length === new Set(ids).size;
}, "Duplicate exerciseId in exercises[]");

export const Lesson = model("Lesson", LessonSchema);
