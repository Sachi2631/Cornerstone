// src/pages/Lesson.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, LinearProgress, Stack, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import Flips from "../components/Flips";
import AudioMatch from "../components/AudioMatch";
import DragDrop from "../components/DragDrop";
import DotMatch from "../components/MatchDots";
import Fact from "../components/Fact";
import Reward from "../components/Rewards";
import RInfo from "../components/RewardInfo";

import { submitAttempt, upsertProgress } from "../services/progress";
import { isAuthed, safe } from "../services/api";
import { getLesson, LessonDoc } from "../services/lessons";

type ResultCb = (args: { result: "correct" | "incorrect"; detail?: any }) => void;
type StepSpec = { key: string; graded: boolean; comp: (on: ResultCb) => React.ReactNode };

// ---------- Local prop contracts (align with your actual components) ----------
type CardData = { id: number; front: string; back: string; audio?: string };

interface FlipsProps {
  onResult?: ResultCb;
  prompt?: string;
  correctCardId?: number;
  cards?: CardData[];
}

interface AudioMatchProps {
  onResult?: ResultCb;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
  prompt?: string;
}

interface DragDropProps {
  onResult?: ResultCb;
  prompt?: string;

  characterBank?: string[];
  correctAnswer?: string;
  audioUrl?: string;

  bankItems?: string[];
  answer?: string[];
  caption?: string;
}

export type DotMatchPair = { hiragana: string; katakana: string };
interface DotMatchProps {
  onResult?: ResultCb;
  pairs: DotMatchPair[];
}

interface FactProps {
  title: string;
  description: string;
}

interface RewardProps {
  title: string;
  xp: number | string;
}

interface RewardInfoProps {
  title: string;
  description: string;
}

// ---------- Cast imported components ----------
const FlipsC = Flips as unknown as React.FC<FlipsProps>;
const AudioC = AudioMatch as unknown as React.FC<AudioMatchProps>;
const DragC = DragDrop as unknown as React.FC<DragDropProps>;
const DotsC = DotMatch as unknown as React.FC<DotMatchProps>;
const FactC = Fact as unknown as React.FC<FactProps>;
const RewardC = Reward as unknown as React.FC<RewardProps>;
const RInfoC = RInfo as unknown as React.FC<RewardInfoProps>;

// ---------- Helpers ----------
function splitPair(s: string): DotMatchPair {
  const [hiragana, katakana] = String(s).split("/");
  return { hiragana: hiragana ?? s, katakana: katakana ?? "" };
}

function normalizeChoiceLabel(s: string): string {
  const [a] = String(s).split("/");
  return a ?? s;
}

function resolveLessonIdentifier(lesson: LessonDoc): string {
  return (
    String((lesson as any).slug || "") ||
    String((lesson as any).id || "") ||
    String((lesson as any).lessonId || "") ||
    String((lesson as any)._id || "")
  );
}

function getLessonHeader(lesson: LessonDoc): string {
  const t = String((lesson as any).title || "Lesson");
  const v = String((lesson as any).version || "");
  return v ? `${t} (${v})` : t;
}

// Optional: create a stable step key even if exerciseId missing
function stepKeyFromExercise(ex: any, fallbackIndex: number): string {
  return String(ex?.exerciseId || ex?._id || `${String(ex?.type || "exercise")}-${fallbackIndex}`);
}

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Route should be /lesson/:lessonId where lessonId is your slug (e.g. hiragana-l1-v1)
  const lessonId = String(params.lessonId || "");

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonDoc | null>(null);

  // ---- DEBUG (safe; does not alter behavior) ----
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  // ---------------------------------------------

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  // Prevent double-submits from components that can fire multiple times
  const answeredStepRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    void (async (): Promise<void> => {
      try {
        setLoading(true);

        if (!lessonId) {
          navigate("/dashboard", { replace: true });
          return;
        }

        const l = await getLesson(lessonId);

        // ---- DEBUG: inspect server payload & critical fields ----
        console.log("[Lesson][debug] lessonId param:", lessonId);
        console.log("[Lesson][debug] raw lesson payload:", l);
        console.log("[Lesson][debug] keys:", l ? Object.keys(l as any) : null);
        console.log("[Lesson][debug] slug:", (l as any)?.slug);
        console.log("[Lesson][debug] _id:", (l as any)?._id);
        console.log("[Lesson][debug] flashcards length:", ((l as any)?.flashcards || []).length);
        console.log("[Lesson][debug] exercises length:", ((l as any)?.exercises || []).length);
        console.log("[Lesson][debug] exercise types:", ((l as any)?.exercises || []).map((x: any) => x?.type));
        console.log("[Lesson][debug] prefecture:", (l as any)?.prefecture);
        // ---------------------------------------------

        if (!mounted) return;

        setLesson(l);

        // ---- DEBUG: keep a snapshot for UI toggle ----
        setDebugInfo({
          lessonIdParam: lessonId,
          received: l,
          receivedKeys: l ? Object.keys(l as any) : [],
          slug: (l as any)?.slug,
          _id: (l as any)?._id,
          flashcardsLen: ((l as any)?.flashcards || []).length,
          exercisesLen: ((l as any)?.exercises || []).length,
          exerciseTypes: ((l as any)?.exercises || []).map((x: any) => x?.type),
          prefecture: (l as any)?.prefecture,
        });
        // ---------------------------------------------

        // reset state on lesson change
        setStep(0);
        setCorrectCount(0);
        setAttemptCount(0);
        answeredStepRef.current = {};
      } catch (e) {
        console.error("[Lesson] fetch failed:", e);
        navigate("/dashboard", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, navigate]);

  const lessonKey = useMemo(() => (lesson ? resolveLessonIdentifier(lesson) : ""), [lesson]);

  // Build steps based on exercises.type (connectTheDots, matchAudioLetter, vocabulary_drag_drop)
  const steps: StepSpec[] = useMemo(() => {
    if (!lesson) return [];

    const out: StepSpec[] = [];

    // 1) Flips uses lesson.flashcards (not exercises)
    const flashcards: string[] = (lesson as any).flashcards || [];
    if (flashcards.length) {
      out.push({
        key: "flips",
        graded: true,
        comp: (on) => {
          const cardData: CardData[] = flashcards.map((raw, idx) => ({
            id: idx,
            front: raw,
            back: "", // you can later populate mnemonic backs if you add them
          }));

          const correctRaw = String((lesson as any).flashcardsCorrect || flashcards[0] || "");
          const idx = flashcards.findIndex((x) => x === correctRaw);
          const correctId = idx >= 0 ? idx : 0;

          return (
            <FlipsC
              onResult={on}
              prompt={"Flip the cards, then select the correct one."}
              cards={cardData}
              correctCardId={correctId}
            />
          );
        },
      });
    }

    // 2) Exercises -> component mapping by `type`
    const exercises: any[] = (lesson as any).exercises || [];
    exercises.forEach((ex, i) => {
      const exType = String(ex?.type || "");
      const key = stepKeyFromExercise(ex, i);

      if (exType === "connectTheDots") {
        out.push({
          key,
          graded: true,
          comp: (on) => <DotsC onResult={on} pairs={(ex.items || []).map(splitPair)} />,
        });
        return;
      }

      if (exType === "matchAudioLetter") {
        const options = (ex.items || []).map(normalizeChoiceLabel);
        const correctAnswer = normalizeChoiceLabel((ex.correctAnswers || [])[0] || options[0] || "");
        out.push({
          key,
          graded: true,
          comp: (on) => (
            <AudioC
              onResult={on}
              options={options}
              correctAnswer={correctAnswer}
              audioUrl={ex.audioUrl}
              prompt={ex.prompt || "Listen and choose the right character"}
            />
          ),
        });
        return;
      }

      if (exType === "vocabulary_drag_drop") {
        out.push({
          key,
          graded: true,
          comp: (on) => (
            <DragC
              onResult={on}
              prompt={ex.prompt || "Build the correct word"}
              characterBank={ex.characterBank || []}
              correctAnswer={ex.correctAnswer}
              audioUrl={ex.audioUrl}
            />
          ),
        });
        return;
      }

      // Unknown exercise types: ignore (keeps logic safe)
      console.warn("[Lesson] unknown exercise type:", exType, ex);
    });

    // 3) Fun fact (informational)
    if ((lesson as any).funFact) {
      out.push({
        key: "fact",
        graded: false,
        comp: () => <FactC title="Fun Fact" description={String((lesson as any).funFact || "")} />,
      });
    }

    // 4) Achievement -> Reward component (match achievements with rewards)
    if ((lesson as any).achievement?.title || (lesson as any).achievement?.xp !== undefined) {
      out.push({
        key: "reward",
        graded: false,
        comp: () => (
          <RewardC
            title={String((lesson as any).achievement?.title || "Lesson Complete!")}
            xp={(lesson as any).achievement?.xp ?? 0}
          />
        ),
      });
    }

    // 5) Notes -> RewardInfo page (kept)
    if ((lesson as any).notes) {
      out.push({
        key: "rinfo",
        graded: false,
        comp: () => <RInfoC title="Notes" description={String((lesson as any).notes || "")} />,
      });
    }

    return out;
  }, [lesson]);

  const pct = steps.length ? Math.round(((step + 1) / steps.length) * 100) : 0;
  const accuracy = attemptCount ? Math.round((100 * correctCount) / attemptCount) : 0;

  // Start progress (no unhandled promise; uses slug/id)
  useEffect(() => {
    if (!lesson) return;
    if (!isAuthed()) return;
    if (!lessonKey) return;

    void (async (): Promise<void> => {
      try {
        await upsertProgress({
          lessonId: lessonKey,
          status: "in_progress",
          lastStep: 0,
          accuracyPct: 0,
        });
      } catch (e) {
        console.error("[Progress] upsert failed:", e);
      }
    })();
  }, [lesson, lessonKey]);

  function advance({
    result,
    detail,
    createAttempt,
    stepKey,
  }: {
    result: "correct" | "incorrect";
    detail?: any;
    createAttempt: boolean;
    stepKey: string;
  }) {
    // prevent repeated submit from same step
    if (answeredStepRef.current[stepKey]) return;
    answeredStepRef.current[stepKey] = true;

    const isLast = step >= steps.length - 1;

    const nextAttemptCount = attemptCount + (createAttempt ? 1 : 0);
    const nextCorrectCount = nextAttemptCount
      ? correctCount + (createAttempt && result === "correct" ? 1 : 0)
      : correctCount;

    const nextAccuracy = nextAttemptCount
      ? Math.round((100 * nextCorrectCount) / nextAttemptCount)
      : accuracy;

    setAttemptCount(nextAttemptCount);
    setCorrectCount(nextCorrectCount);

    if (lesson && isAuthed() && createAttempt && lessonKey) {
      void (async (): Promise<void> => {
        try {
          await submitAttempt({ lessonId: lessonKey, stepIndex: step, result, detail });
        } catch (e) {
          console.error("[Attempt] submit failed:", e);
        }
      })();
    }

    if (!isLast) {
      const nextStep = step + 1;
      setStep(nextStep);

      if (lesson && isAuthed() && lessonKey) {
        void (async (): Promise<void> => {
          try {
            await upsertProgress({
              lessonId: lessonKey,
              status: "in_progress",
              lastStep: nextStep,
              accuracyPct: nextAccuracy,
            });
          } catch (e) {
            console.error("[Progress] upsert failed:", e);
          }
        })();
      }
    } else {
      if (lesson && isAuthed() && lessonKey) {
        void (async (): Promise<void> => {
          try {
            await upsertProgress({
              lessonId: lessonKey,
              status: "completed",
              lastStep: step,
              accuracyPct: nextAccuracy,
            });
          } catch (e) {
            console.error("[Progress] upsert failed:", e);
          }
        })();
      }
      navigate("/dashboard");
    }
  }

  const handleResult = (args: { result: "correct" | "incorrect"; detail?: any }) => {
    const k = steps[step]?.key || String(step);
    advance({ ...args, createAttempt: true, stepKey: k });
  };

  const handleSkip = safe(async () => {
    const graded = steps[step]?.graded ?? false;
    const k = steps[step]?.key || String(step);
    advance({
      result: "incorrect",
      detail: { skipped: true },
      createAttempt: graded,
      stepKey: k,
    });
  });

  const handleNext = () => {
    const graded = steps[step]?.graded ?? false;
    const k = steps[step]?.key || String(step);
    advance({
      result: graded ? "incorrect" : "correct",
      detail: graded ? { nextOnGraded: true } : { informational: true },
      createAttempt: graded,
      stepKey: k,
    });
  };

  // If user goes back manually, allow answering again (remove step lock for that step key)
  const handleBack = () => {
    const prevStep = Math.max(0, step - 1);
    const prevKey = steps[prevStep]?.key;
    if (prevKey) delete answeredStepRef.current[prevKey];
    setStep(prevStep);
  };

  if (loading) {
    return (
      <Box sx={{ px: 3, py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson || !steps.length) {
    return (
      <Box sx={{ px: 3, py: 6 }}>
        <Typography variant="h6">Lesson unavailable.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1000, mx: "auto" }}>
      <Stack direction="row" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <LinearProgress variant="determinate" value={pct} />
        </Box>

        <Typography variant="body2">{pct}%</Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          Acc: {accuracy}%
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="text" onClick={() => navigate("/dashboard")}>
          Save & Exit
        </Button>
      </Stack>

      <Typography variant="h6" sx={{ mb: 1 }}>
        {getLessonHeader(lesson)}
      </Typography>

      {/* ---- DEBUG UI (optional) ---- */}
      <Box sx={{ mb: 2 }}>
        <Button size="small" variant="outlined" onClick={() => setDebugOpen((v) => !v)}>
          {debugOpen ? "Hide Debug" : "Show Debug"}
        </Button>

        {debugOpen && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 1,
              maxHeight: 260,
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </Box>
        )}
      </Box>
      {/* ------------------------------ */}

      <Box sx={{ minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {steps[step]?.comp(handleResult)}
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Button disabled={step === 0} onClick={handleBack}>
          Back
        </Button>

        <Stack direction="row" gap={1}>
          <Button onClick={handleSkip} color="warning" variant="outlined">
            Skip
          </Button>
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Lesson;