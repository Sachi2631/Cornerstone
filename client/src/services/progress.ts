import { fetchJSON, isAuthed } from "./api";

export async function submitAttempt(payload: {
  lessonId: string; stepIndex: number; result: "correct" | "incorrect"; detail?: any;
}): Promise<void> {
  if (!isAuthed()) {
    console.warn("[CLIENT attempt] SKIP send (not authed)", payload);
    return;
  }
  console.log("[CLIENT attempt] SEND", payload);
  await fetchJSON("/api/attempts", { method: "POST", body: JSON.stringify(payload) });
}

export async function upsertProgress(payload: {
  lessonId: string; status: "in_progress" | "completed"; lastStep: number; accuracyPct?: number;
}): Promise<void> {
  if (!isAuthed()) {
    console.warn("[CLIENT progress] SKIP send (not authed)", payload);
    return;
  }
  console.log("[CLIENT progress] SEND", payload);
  await fetchJSON("/api/progress", { method: "PATCH", body: JSON.stringify(payload) });
}
