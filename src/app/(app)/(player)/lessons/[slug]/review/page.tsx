import { redirect } from "next/navigation";

import { getLessonBySlug } from "@/lib/content/content";
import { collectLessonTerms } from "@/lib/content/lessonTerms";
import TermReviewPage from "@/features/learning/components/TermReviewPage";

/*
 * Every term a lesson taught, on one page — a study aid rather than a graded
 * screen, so it reads published content directly the same way the player
 * does rather than needing its own progress-aware plumbing.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const lesson = await getLessonBySlug(slug);
  if (!lesson) redirect("/dashboard");

  const terms = collectLessonTerms(lesson);

  return <TermReviewPage lesson={lesson} terms={terms} />;
}
