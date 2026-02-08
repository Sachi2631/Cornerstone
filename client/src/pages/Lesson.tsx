import React, { useEffect, useMemo, useState } from "react";
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

// --- Local prop contracts matching how we use each component here ---
type CardData = { id: number; front: string; back: string };

interface FlipsProps {
  onResult: ResultCb;
  cards: CardData[];
  correctCardId: number;
}

interface AudioMatchProps {
  onResult: ResultCb;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
  prompt?: string;
}

interface DragDropProps {
  onResult: ResultCb;
  prompt?: string;
  characterBank?: string[];
  correctAnswer?: string;
  audioUrl?: string;

  // keep legacy so older uses don't break
  bankItems?: string[];
  answer?: string[];
  caption?: string;
}


interface DotMatchPair {
  hiragana: string;
  katakana: string;
}
interface DotMatchProps {
  onResult: ResultCb;
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

// --- Cast imported components to the prop contracts above ---
const FlipsC = Flips as unknown as React.FC<FlipsProps>;
const AudioC = AudioMatch as unknown as React.FC<AudioMatchProps>;
const DragC = DragDrop as unknown as React.FC<DragDropProps>;
const DotsC = DotMatch as unknown as React.FC<DotMatchProps>;
const FactC = Fact as unknown as React.FC<FactProps>;
const RewardC = Reward as unknown as React.FC<RewardProps>;
const RInfoC = RInfo as unknown as React.FC<RewardInfoProps>;

function splitPair(s: string): DotMatchPair {
  // "あ/ア" => { hiragana: "あ", katakana: "ア" }
  const [hiragana, katakana] = String(s).split("/");
  return { hiragana: hiragana ?? s, katakana: katakana ?? "" };
}

function normalizeChoiceLabel(s: string): string {
  // For audio choices we show only hiragana by default: "あ/ア" -> "あ"
  const [a] = String(s).split("/");
  return a ?? s;
}

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // You should route like /lesson/:lessonId
  const lessonId = (params.lessonId || "lesson_1_v1") as string;

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonDoc | null>(null);

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const l = await getLesson(lessonId);
        if (!mounted) return;
        setLesson(l);
      } catch (e) {
        console.error("[Lesson] fetch failed:", e);
        // if lesson can't load, go back
        navigate("/dashboard", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, navigate]);

  const steps: StepSpec[] = useMemo(() => {
    if (!lesson) return [];

    const out: StepSpec[] = [];

    // 1) Flips from flashcards
    if (lesson.flashcards?.length) {
      out.push({
        key: "flips",
        graded: true,
        comp: (on) => {
          const cardData: CardData[] = lesson.flashcards.map((raw, index) => ({
            id: index,
            front: raw,
            back: "",
          }));

          const correctRaw = lesson.flashcardsCorrect || lesson.flashcards[0] || "";
          const idx = lesson.flashcards.findIndex((x) => x === correctRaw);
          const correctId = idx >= 0 ? idx : 0;

          return <FlipsC onResult={on} cards={cardData} correctCardId={correctId} />;
        },
      });
    }

    // 2) Exercises drive components
    for (const ex of lesson.exercises || []) {
      if (ex.type === "connectTheDots") {
        out.push({
          key: ex.exerciseId,
          graded: true,
          comp: (on) => <DotsC onResult={on} pairs={(ex.items || []).map(splitPair)} />,
        });
      }

      if (ex.type === "matchAudioLetter") {
        const options = (ex.items || []).map(normalizeChoiceLabel);
        const correctAnswer = normalizeChoiceLabel((ex.correctAnswers || [])[0] || options[0] || "");
        out.push({
          key: ex.exerciseId,
          graded: true,
          comp: (on) => (
            <AudioC
              onResult={on}
              options={options}
              correctAnswer={correctAnswer}
              audioUrl={ex.audioUrl}
              prompt={ex.prompt}
            />
          ),
        });
      }

      if (ex.type === "vocabulary_drag_drop") {
        out.push({
          key: ex.exerciseId,
          graded: true,
          comp: (on) => (
            <DragC
              onResult={on}
              prompt={ex.prompt || "Build the correct word"}
              characterBank={ex.characterBank || []}
              correctAnswer={ex.correctAnswer}
            />
          ),
        });
      }
    }

    // 3) Fun fact
    if (lesson.funFact) {
      out.push({
        key: "fact",
        graded: false,
        comp: () => <FactC title="Fun Fact" description={lesson.funFact || ""} />,
      });
    }

    // 4) Rewards
    if (lesson.achievement?.title || lesson.achievement?.xp !== undefined) {
      out.push({
        key: "reward",
        graded: false,
        comp: () => (
          <RewardC title={lesson.achievement?.title || "Lesson Complete!"} xp={lesson.achievement?.xp ?? 0} />
        ),
      });
    }

    // 5) Optional info page
    if (lesson.notes) {
      out.push({
        key: "rinfo",
        graded: false,
        comp: () => <RInfoC title="Notes" description={lesson.notes || ""} />,
      });
    }

    return out;
  }, [lesson]);

  const pct = steps.length ? Math.round(((step + 1) / steps.length) * 100) : 0;
  const accuracy = attemptCount ? Math.round((100 * correctCount) / attemptCount) : 0;

  // IMPORTANT: catch upsertProgress errors so 500 doesn't crash the UI (your current code triggers Uncaught runtime)
  useEffect(() => {
    if (!lesson) return;

    if (isAuthed()) {
      void (async () => {
        try {
          await upsertProgress({
            lessonId: lesson.lessonId,
            status: "in_progress",
            lastStep: 0,
            accuracyPct: 0,
          });
        } catch (e) {
          console.error("[Progress] upsert failed:", e);
        }
      })();
    }
  }, [lesson]);

  function advance({
    result,
    detail,
    createAttempt,
  }: {
    result: "correct" | "incorrect";
    detail?: any;
    createAttempt: boolean;
  }) {
    const isLast = step >= steps.length - 1;
    const nextAttemptCount = attemptCount + (createAttempt ? 1 : 0);
    const nextCorrectCount = nextAttemptCount
      ? correctCount + (createAttempt && result === "correct" ? 1 : 0)
      : correctCount;
    const nextAccuracy = nextAttemptCount ? Math.round((100 * nextCorrectCount) / nextAttemptCount) : accuracy;

    setAttemptCount(nextAttemptCount);
    setCorrectCount(nextCorrectCount);

    if (lesson && isAuthed() && createAttempt) {
      void (async () => {
        try {
          await submitAttempt({ lessonId: lesson.lessonId, stepIndex: step, result, detail });
        } catch (e) {
          console.error("[Attempt] submit failed:", e);
        }
      })();
    }

    if (!isLast) {
      const nextStep = step + 1;
      setStep(nextStep);

      if (lesson && isAuthed()) {
        void (async () => {
          try {
            await upsertProgress({
              lessonId: lesson.lessonId,
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
      if (lesson && isAuthed()) {
        void (async () => {
          try {
            await upsertProgress({
              lessonId: lesson.lessonId,
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
    advance({ ...args, createAttempt: true });
  };

  const handleSkip = safe(async () => {
    advance({
      result: "incorrect",
      detail: { skipped: true },
      createAttempt: steps[step]?.graded ?? false,
    });
  });

  const handleNext = () => {
    const graded = steps[step]?.graded ?? false;
    advance({
      result: graded ? "incorrect" : "correct",
      detail: graded ? { nextOnGraded: true } : { informational: true },
      createAttempt: graded,
    });
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

      <Box sx={{ minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {steps[step]?.comp(handleResult)}
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
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
