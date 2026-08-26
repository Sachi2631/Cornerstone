import "server-only";

import { desc, eq } from "drizzle-orm";

import type { NotebookEntry } from "@/features/learning/types";
import { getLessonRoute } from "./content/content";
import { db } from "./db";
import { userLessonNotes } from "./db/schema";
import { getSession } from "./session";

/**
 * Every note the signed-in learner has written, most recently edited first —
 * the shared "notebook" the sticky-note popup reads from regardless of which
 * lesson's icon opened it. Signed out reads as an empty notebook rather than
 * an error, the same choice `getProgressBySlug` makes.
 */
export async function getNotebook(): Promise<NotebookEntry[]> {
  const session = await getSession();
  if (!session) return [];

  const rows = await db
    .select()
    .from(userLessonNotes)
    .where(eq(userLessonNotes.userId, session.user.id))
    .orderBy(desc(userLessonNotes.updatedAt));

  return Promise.all(
    rows.map(async (row) => {
      const lesson = await getLessonRoute(row.lessonId);
      return {
        lessonId: row.lessonId,
        // Same fallback chain the lesson list and player already show a
        // learner — `cardTitle` when authored, otherwise the CMS title.
        title: lesson?.cardTitle?.trim() || lesson?.title || row.lessonId,
        href: lesson?.href,
        body: row.body,
        updatedAt: row.updatedAt.toISOString(),
      };
    })
  );
}
