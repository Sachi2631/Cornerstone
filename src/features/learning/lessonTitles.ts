import { termText } from "@/features/exercises/components/termText";
import { collectLessonTerms, TAUGHT_KEYS } from "@/lib/content/lessonTerms";
import type { Lesson } from "@/payload/payload-types";

/*
 * Deriving a lesson's display title — no "use client" here on purpose.
 * `deriveReadingCardTitle` used to live in `LessonsListPage.tsx`, which is a
 * client component; every export of a "use client" file is a client
 * reference regardless of what the function itself touches, so the level
 * review page (a server component) could not call it from there. Nothing in
 * this function needs the browser — it belongs in a plain module both sides
 * can import.
 */

/*
 * A Reading & Writing card with no title of its own shows the characters it
 * teaches — "あ、い、う…", every kana term taught anywhere in the lesson,
 * not one particular block's worth. Matches the format Lesson 1 was given
 * by hand, and — the point of building it this way — keeps matching it: add
 * が to a lesson that already teaches か and this recomputes on its own,
 * whether が arrives in the same `vocabList` (any layout, not just a
 * "flashcards" one — the previous version's blind spot), a `matchPairs`, or
 * anywhere else `TAUGHT_KEYS` reaches. No title to retype by hand, and
 * nothing here to update when a future block type joins the library.
 *
 * `kind === "kana"` rather than "every term the lesson teaches" — a Reading
 * & Writing lesson's `buildSentence`/`speakAndScore` subject can be a whole
 * word, and the title says which *characters* this lesson covers, not every
 * word built from them.
 */
export function deriveReadingCardTitle(lesson: Lesson): string | undefined {
  const characters = collectLessonTerms(lesson, TAUGHT_KEYS)
    .filter((term) => term.kind === "kana")
    .map((term) => termText(term))
    .filter(Boolean);

  return characters.length ? characters.join("、") : undefined;
}

/** The title a learner sees for a lesson document, wherever the CMS field is empty. */
export function lessonDisplayTitle(lesson: Lesson): string {
  return (
    lesson.cardTitle?.trim() ||
    deriveReadingCardTitle(lesson) ||
    `Lesson ${lesson.level}.${lesson.part}`
  );
}
