// src/services/progress.ts
import { json } from "./api";

export type ProgressStatus = "in_progress" | "completed";

export type ProgressDoc = {
  _id?: string;
  userId?: string;
  lessonId: string;
  status: ProgressStatus;
  lastStep: number;
  accuracyPct?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type UpNextLesson = {
  lessonId: string;
  slug: string;
  title: string;
  version?: string;
  prefecture?: string;
  lastStep: number;
  accuracyPct?: number;
  status: ProgressStatus;
};

export async function upsertProgress(payload: {
  lessonId: string;
  status: ProgressStatus;
  lastStep: number;
  accuracyPct?: number;
}): Promise<ProgressDoc> {
  return json<ProgressDoc>("/api/progress", {
    method: "POST",
    data: payload,
  });
}

export async function getUpNextLesson(): Promise<UpNextLesson | null> {
  const data = await json<{ upNext: UpNextLesson | null }>("/api/progress/up-next");
  return data?.upNext ?? null;
}