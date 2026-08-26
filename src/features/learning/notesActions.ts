"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { userLessonNotes } from "@/lib/db/schema";
import { getPreviewEditor, getSession } from "@/lib/session";
import type { SaveResult } from "./types";

/*
 * Write a learner's sticky note for one lesson.
 *
 * Mirrors `upsertProgress`: userId always comes from the session, never the
 * argument, and a CMS editor previewing (no learner session) writes nothing
 * without that being an error.
 *
 * An empty body deletes the row rather than storing a blank one — clearing a
 * note is throwing the sticky away, not writing an empty sticky, and it keeps
 * the notebook from listing lessons nobody actually wrote anything on.
 */
export async function upsertLessonNote(payload: {
  lessonId: string;
  body: string;
}): Promise<SaveResult> {
  const session = await getSession();
  if (!session) {
    if (await getPreviewEditor()) return { ok: true, saved: false };

    console.error("[notes] save dropped — no learner session", { lessonId: payload.lessonId });
    return {
      ok: false,
      reason: "signed-out",
      message: "You've been signed out, so this wasn't saved. Sign in again to keep it.",
    };
  }

  const lessonId = String(payload.lessonId || "").trim();
  if (!lessonId) {
    console.error("[notes] save rejected — empty lessonId", { payload });
    return { ok: false, reason: "failed", message: "That didn't save. Try again." };
  }

  const body = String(payload.body ?? "");
  const userId = session.user.id;

  try {
    if (body.trim() === "") {
      await db
        .delete(userLessonNotes)
        .where(and(eq(userLessonNotes.userId, userId), eq(userLessonNotes.lessonId, lessonId)));
    } else {
      await db
        .insert(userLessonNotes)
        .values({ userId, lessonId, body, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: [userLessonNotes.userId, userLessonNotes.lessonId],
          set: { body, updatedAt: new Date() },
        });
    }
  } catch (error) {
    console.error("[notes] save failed", { lessonId, error });
    return { ok: false, reason: "failed", message: "That didn't save. Try again." };
  }

  revalidatePath("/lessons");
  revalidatePath(`/lessons/${lessonId}`);

  return { ok: true, saved: true };
}
