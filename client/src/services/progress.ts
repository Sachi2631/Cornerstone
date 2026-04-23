export interface ProgressResponse {
  lessonId: string;
  status: "in_progress" | "completed";
  lastStep: number;
  accuracyPct?: number;
}

export async function upsertProgress(data: {
  lessonId: string;
  status: "in_progress" | "completed";
  lastStep: number;
  accuracyPct?: number;
}): Promise<ProgressResponse> {
  const res = await fetch("/api/progress", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  return res.json(); // 👈 THIS is critical
}

export async function submitAttempt(_: {
  lessonId: string;
  stepIndex: number;
  result: "correct" | "incorrect";
  detail?: any;
}): Promise<void> {
  // You can later send this to backend
  return;
}