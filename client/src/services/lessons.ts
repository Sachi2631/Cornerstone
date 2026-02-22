// src/services/lessons.ts
import api from "./api";

export type LessonExercise =
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

export type LessonDoc = {
  _id: string;
  slug: string;
  title: string;
  version?: string;

  flashcards: string[];
  funFact?: string;
  notes?: string;

  exercises?: LessonExercise[];
  achievement?: { title: string; xp: number };

  prefecture: string;
  isActive?: boolean;
  tags?: string[];
};

export type LessonListItem = Pick<
  LessonDoc,
  "_id" | "slug" | "title" | "version" | "flashcards" | "prefecture" | "isActive"
>;

export async function listLessons(params?: { prefecture?: string; includeInactive?: boolean }) {
  const sp = new URLSearchParams();
  if (params?.prefecture) sp.set("prefecture", params.prefecture);
  if (params?.includeInactive) sp.set("includeInactive", "true");

  const url = sp.toString() ? `/api/lessons?${sp.toString()}` : "/api/lessons";
  const res = await api.get<{ lessons: LessonListItem[] }>(url);
  return res.data.lessons;
}

export async function getLesson(lessonIdOrSlug: string) {
  const res = await api.get<{ lesson: LessonDoc }>(
    `/api/lessons/${encodeURIComponent(lessonIdOrSlug)}`
  );
  return res.data.lesson;
}