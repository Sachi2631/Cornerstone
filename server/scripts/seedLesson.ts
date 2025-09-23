import mongoose from "mongoose";
import { Lesson } from "../src/models/Lesson";

(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await Lesson.deleteMany({ slug: "lesson-1" });
  await Lesson.create({
    slug: "lesson-1",
    title: "Hiragana Basics 1",
    kind: "mixed",
    steps: [
      { type: "fact", data: { text: "Hiragana is used for native Japanese words." } },
      { type: "audioPlay", data: { audioUrl: "/audio/a.mp3", prompt: "Listen" } },
      { type: "dragDrop", data: { prompt: "Arrange あいう", items: ["あ","い","う","え"], answer: ["あ","い","う"] } },
      { type: "quizMCQ", data: { prompt: "Pick あ", choices: ["あ","い","ウ"], answerIndex: 0 } }
    ]
  });
  console.log("Seeded lesson-1");
  await mongoose.disconnect();
})();
