import assert from "node:assert/strict";
import test from "node:test";

import { collectLessonTerms } from "./lessonTerms";
import type { Lesson, Term } from "../../payload/payload-types";

/*
 * What breaks here breaks quietly. A term this misses is not an error anywhere:
 * the review page renders one card fewer, and `audioForTile` returns undefined
 * so a tile's play button simply does not appear. Both look exactly like
 * content nobody has authored yet, which is why the rich-text gap survived as
 * long as it did.
 *
 * So the cases worth holding are the ones with no visible failure mode:
 * a term reachable only through Lexical, the first-appearance ordering, and
 * dedup across the two different ways of referencing the same word.
 */

const term = (id: number, key: string): Term => ({ id, key }) as Term;

/** A `termRef` inline block as Lexical stores it — the shape prose.ts writes. */
const termRefNode = (t: Term) => ({
  type: "inlineBlock",
  fields: { blockType: "termRef", term: t, display: "furigana" },
});

/** A rich-text field holding the given inline nodes, in order. */
const prose = (...nodes: unknown[]) => ({
  root: { type: "root", children: [{ type: "paragraph", children: nodes }] },
});

const lesson = (...components: unknown[][]): Lesson =>
  ({ steps: components.map((c) => ({ components: c })) }) as unknown as Lesson;

const keys = (l: Lesson) => collectLessonTerms(l).map((t) => t.key);

test("collects terms from the relationship fields of exercise blocks", () => {
  const l = lesson(
    [{ blockType: "vocabList", terms: [term(1, "a"), term(2, "b")] }],
    [{ blockType: "buildSentence", term: term(3, "c") }],
    [{ blockType: "listenAndChoose", term: term(4, "d"), distractors: [term(5, "e")] }]
  );
  assert.deepEqual(keys(l), ["a", "b", "c", "d", "e"]);
});

test("finds a term referenced only from inside rich text", () => {
  // The regression this function was rewritten for: a word taught in prose and
  // nowhere else. The old blockType switch never descended into the document.
  const l = lesson([{ blockType: "prose", body: prose(termRefNode(term(1, "arigatou"))) }]);
  assert.deepEqual(keys(l), ["arigatou"]);
});

test("finds a term nested deeper than the top level of a block", () => {
  // Rich text can sit inside an array inside a block, which is why the walk is
  // recursive rather than a fixed set of field lookups.
  const l = lesson([
    {
      blockType: "dialogue",
      lines: [
        { speaker: "A", body: prose({ type: "text", text: "hello" }) },
        { speaker: "B", body: prose(termRefNode(term(7, "hajimemashite"))) },
      ],
    },
  ]);
  assert.deepEqual(keys(l), ["hajimemashite"]);
});

test("de-dupes a term referenced twice, keeping the first appearance", () => {
  const shared = term(1, "desu");
  const l = lesson(
    [{ blockType: "vocabList", terms: [shared, term(2, "kore")] }],
    [{ blockType: "listenAndChoose", term: term(3, "sore"), distractors: [shared] }]
  );
  assert.deepEqual(keys(l), ["desu", "kore", "sore"]);
});

test("de-dupes across a rich-text reference and a relationship field", () => {
  // The two paths reach the same word by different routes; a term is one term.
  const shared = term(1, "sumimasen");
  const l = lesson(
    [{ blockType: "prose", body: prose(termRefNode(shared)) }],
    [{ blockType: "vocabList", terms: [shared] }]
  );
  assert.deepEqual(keys(l), ["sumimasen"]);
});

test("orders a prose term before a later block's term", () => {
  // First-appearance order is the documented contract — a learner should meet a
  // word in the list where they met it in the lesson.
  const l = lesson(
    [{ blockType: "prose", body: prose(termRefNode(term(1, "first"))) }],
    [{ blockType: "vocabList", terms: [term(2, "second")] }]
  );
  assert.deepEqual(keys(l), ["first", "second"]);
});

test("skips an unpopulated relationship rather than emitting a bare id", () => {
  // Too shallow a read gives back a number. There is no term to show; dropping
  // it is what content:verify already fails on, so it must not crash or leak.
  const l = lesson([{ blockType: "vocabList", terms: [1, term(2, "real")] }]);
  assert.deepEqual(keys(l), ["real"]);
});

test("does not descend into a term's own fields", () => {
  // A Term is terminal. Were the walk to recurse into one, a relationship on
  // the term itself would pull in words this lesson never taught.
  const nested = { ...term(1, "outer"), term: term(99, "should-not-appear") } as Term;
  const l = lesson([{ blockType: "buildSentence", term: nested }]);
  assert.deepEqual(keys(l), ["outer"]);
});

test("a lesson with no steps yields nothing", () => {
  assert.deepEqual(collectLessonTerms({} as Lesson), []);
  assert.deepEqual(collectLessonTerms({ steps: null } as unknown as Lesson), []);
});
