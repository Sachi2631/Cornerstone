import type { Lesson, Term } from "../../payload/payload-types";

/*
 * Every term a lesson actually teaches, read off its blocks rather than
 * authored separately — a lesson has no `terms` field of its own.
 *
 * De-duped by id, in first-appearance order: a term introduced in a
 * `vocabList` and later drawn on as a `listenAndChoose` distractor should
 * only show up once, where a learner first met it.
 *
 * ── Why this walks for keys instead of switching on blockType ────────────────
 *
 * It used to switch on the five block types with a term relationship, which
 * missed the sixth place a term can be referenced: a `termRef` inline block
 * inside a rich-text document (`payload/fields/prose.ts`). A term taught only
 * in a `prose` or `dialogue` block is still taught, and it was invisible here —
 * so the review page left it out, and `audioForTile` could not find the
 * recording for a `buildSentence` tile introduced that way.
 *
 * A switch also has to be kept in step with the block library by hand, and the
 * comment naming its five types had already drifted. Walking for the keys a
 * term hangs off has neither problem, and `termRef` needs no special case: its
 * relationship sits at `fields.term`, so the same key rule reaches it.
 */

type LessonStep = NonNullable<Lesson["steps"]>[number];

/**
 * The keys a catalogue term hangs off, across every block that references one:
 * `terms` (vocabList, matchPairs), `term` (listenAndChoose, buildSentence,
 * speakAndScore, and the `termRef` inline block) and `distractors`
 * (listenAndChoose). No other field in the library carries one.
 */
const TERM_KEYS = new Set(["term", "terms", "distractors"]);

export function collectLessonTerms(lesson: Lesson): Term[] {
  const seen = new Set<number>();
  const terms: Term[] = [];

  const add = (value: unknown): void => {
    /*
     * A bare id rather than an object means the read did not populate deeply
     * enough. There is no term to show either way, and it is not this
     * function's job to report it — `content:verify` fails on exactly that,
     * which is why `CONTENT_DEPTH` is 2.
     */
    if (!value || typeof value !== "object") return;

    const term = value as Term;
    if (typeof term.id !== "number" || seen.has(term.id)) return;

    seen.add(term.id);
    terms.push(term);
  };

  /*
   * One walk over the raw block rather than a traversal per field type: blocks
   * nest arrays inside blocks inside arrays and a rich-text field can appear at
   * any level, so the shape of that tree is not worth encoding a second time.
   * The same argument `scripts/content/verify.ts` makes for its own walk.
   *
   * Key order is insertion order, which for a document read out of Payload is
   * the order it was authored in — that is what keeps the result in
   * first-appearance order rather than something arbitrary.
   */
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== "object") return;

    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (TERM_KEYS.has(key)) {
        // Terminal: a term's own fields are not somewhere another term hides,
        // and descending into one would collect words this lesson never taught.
        if (Array.isArray(value)) value.forEach(add);
        else add(value);
        continue;
      }

      if (value && typeof value === "object") walk(value);
    }
  };

  for (const step of (lesson.steps ?? []) as LessonStep[]) walk(step.components);

  return terms;
}
