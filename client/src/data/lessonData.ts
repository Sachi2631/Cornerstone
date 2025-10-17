// src/data/lessonData.ts

export interface LessonData {
  lessonId: string;
  flashcards: {
    characters: string[];
    correctAnswer: string;
  };
  connectTheDots: {
    pairs: { hiragana: string; katakana: string }[];
  };
  audioMatch1: {
    options: string[];
    correctAnswer: string;
  };
  audioMatch2: {
    options: string[];
    correctAnswer: string;
  };
  audioMatch3: {
    options: string[];
    correctAnswer: string;
  };
  vocab: string[];
  funFact: {
    title: string;
    description: string;
  };
  achievement: {
    title: string;
    xp: string;
  };
  souvenir: {
    title: string;
    description: string;
  };
}

export const lesson1Data: LessonData = {
  lessonId: "lesson-1",
  flashcards: {
    characters: ["あ/ア", "い/イ", "う/ウ"],
    correctAnswer: "う/ウ",
  },
  connectTheDots: {
    pairs: [
      { hiragana: "あ", katakana: "ア" },
      { hiragana: "い", katakana: "イ" },
      { hiragana: "う", katakana: "ウ" },
    ],
    
  },
  audioMatch1: {
    options: ["あ/ア", "い/イ", "う/ウ"],
    correctAnswer: "あ/ア",
  },
  audioMatch2: {
    options: ["あ/ア", "い/イ", "う/ウ"],
    correctAnswer: "い/イ",
  },
  audioMatch3: {
    options: ["あ/ア", "い/イ", "う/ウ"],
    correctAnswer: "う/ウ",
  },
  vocab: ["あ", "い", "う"],
  funFact: {
    title: "Hiragana vs. Katakana",
    description: "Hiragana is used for native Japanese words, while Katakana is used for foreign loanwords!",
  },
  achievement: {
    title: "First Lesson Completed!",
    xp: "You earned +10 xp!",
  },
  souvenir: {
    title: "Arita-ware Vase",
    description: "This special blue-and-white porcelain vase is called 'sometsuke' and comes from Saga Prefecture!",
  },
};