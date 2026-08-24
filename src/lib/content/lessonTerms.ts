import type { Lesson, Term } from "../../payload/payload-types";

/*
 * Every term a lesson actually teaches, read off its blocks rather than
 * authored separately — a lesson has no `terms` field of its own, only the
 * five block types below that reference one.
 *
 * De-duped by id, in first-appearance order: a term introduced in a
 * `vocabList` and later drawn on as a `listenAndChoose` distractor should
 * only show up once, where a learner first met it.
 */

type LessonStep = NonNullable<Lesson["steps"]>[number];
type LessonBlock = LessonStep["components"][number];

function asTerm(value: Term | number | null | undefined): Term | null {
  return value && typeof value === "object" ? value : null;
}

export function collectLessonTerms(lesson: Lesson): Term[] {
  const seen = new Set<number>();
  const terms: Term[] = [];

  const add = (value: Term | number | null | undefined) => {
    const term = asTerm(value);
    if (!term || seen.has(term.id)) return;
    seen.add(term.id);
    terms.push(term);
  };

  for (const step of lesson.steps ?? []) {
    for (const block of (step.components ?? []) as LessonBlock[]) {
      switch (block.blockType) {
        case "vocabList":
        case "matchPairs":
          (block.terms ?? []).forEach(add);
          break;
        case "listenAndChoose":
          add(block.term);
          (block.distractors ?? []).forEach(add);
          break;
        case "buildSentence":
        case "speakAndScore":
          add(block.term);
          break;
        default:
          break;
      }
    }
  }

  return terms;
}
