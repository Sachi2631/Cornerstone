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

const BASE = "/api/lessons";

function normalizePrefecture(p?: string) {
  return (p || "").trim();
}

async function getWithFallback<T>(url: string) {
  try {
    return await api.get<T>(url);
  } catch (err: any) {
    // Optional backward-compat: if some server is mounted at /lessons not /api/lessons
    const status = err?.response?.status;
    if (status === 404 && url.startsWith("/api/")) {
      const alt = url.replace(/^\/api/, "");
      return await api.get<T>(alt);
    }
    throw err;
  }
}

export async function listLessons(params?: { prefecture?: string; includeInactive?: boolean }) {
  const sp = new URLSearchParams();

  const prefecture = normalizePrefecture(params?.prefecture);
  if (prefecture) sp.set("prefecture", prefecture);

  if (params?.includeInactive) sp.set("includeInactive", "true");

  const url = sp.toString() ? `${BASE}?${sp.toString()}` : BASE;

  const res = await getWithFallback<{ lessons: LessonListItem[] }>(url);
  return res.data.lessons;
}

export async function getLesson(lessonIdOrSlug: string) {
  const id = String(lessonIdOrSlug || "").trim();
  const res = await getWithFallback<{ lesson: LessonDoc }>(`${BASE}/${encodeURIComponent(id)}`);
  return res.data.lesson;
}