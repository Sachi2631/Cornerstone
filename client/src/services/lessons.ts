import { getToken } from "./api";

export type LessonExercise =
  | {
      exerciseId: string;
      type: "connectTheDots";
      items: string[];
      correctAnswers: string[];
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
  lessonId: string;
  title: string;
  version?: string;
  flashcards: string[];
  flashcardsCorrect?: string;
  funFact?: string;
  notes?: string;
  exercises: LessonExercise[];
  achievement?: { title?: string; xp?: number };
};

export async function getLesson(lessonId: string): Promise<LessonDoc> {
  const token = getToken();
  if (!token) throw new Error("Missing token");

  const res = await fetch(`/api/lessons/${encodeURIComponent(lessonId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.error || data?.message || `Failed to fetch lesson (${res.status})`;
    throw new Error(msg);
  }

  return (data?.lesson ?? data) as LessonDoc;
}
