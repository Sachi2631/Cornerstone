// src/pages/Lesson.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
  CircularProgress,
  Container,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import BugReportIcon from "@mui/icons-material/BugReport";
import { useNavigate, useParams } from "react-router-dom";

import Flips from "../components/Flips";
import AudioMatch from "../components/AudioMatch";
import DragDrop from "../components/DragDrop";
import DotMatch from "../components/MatchDots";
import Fact from "../components/Fact";
import Reward from "../components/Rewards";
import RInfo from "../components/RewardInfo";

// import { getProgress, upsertProgress } from "../services/progress";
import { isAuthed } from "../services/api";
import { getLesson, LessonDoc } from "../services/lessons";

type ResultCb = (args: { result: "correct" | "incorrect"; detail?: any }) => void;

type StepSpec = {
  key: string;
  graded: boolean;
  comp: (on: ResultCb) => React.ReactElement;
};

const FlipsC = Flips as any;
const AudioC = AudioMatch as any;
const DragC = DragDrop as any;
const DotsC = DotMatch as any;
const FactC = Fact as any;
const RewardC = Reward as any;
const RInfoC = RInfo as any;

function resolveLessonIdentifier(lesson: LessonDoc): string {
  return lesson.slug || (lesson as any)._id || (lesson as any).id || "";
}

function stepLabelFromKey(key: string): string {
  if (key === "flips") return "Flashcards";
  if (key.includes("dots")) return "Connect Dots";
  if (key.includes("audio")) return "Audio Match";
  if (key.includes("drag")) return "Drag & Drop";
  if (key === "fact") return "Fun Fact";
  if (key === "reward") return "Reward";
  if (key === "rinfo") return "Notes";
  return "Exercise";
}

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId = "" } = useParams();

  const [lesson, setLesson] = useState<LessonDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingExit, setSavingExit] = useState(false);

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  const answeredStepRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;

    void (async () => {
      try {
        if (!lessonId) {
          navigate("/dashboard");
          return;
        }

        setLoading(true);

        const l = await getLesson(lessonId);
        if (!mounted) return;

        setLesson(l);

        let savedStep = 0;

        if (isAuthed()) {
          try {
            const progress = await upsertProgress({
              lessonId: resolveLessonIdentifier(l),
              status: "in_progress",
              lastStep: 0,
              accuracyPct: 0,
            });
            if (progress && typeof progress.lastStep === "number") {
              savedStep = progress.lastStep;
            }
          } catch (e) {
            console.error("[Lesson] load progress failed:", e);
          }
        }

        setStep(savedStep); // clamped later once steps exist
        setCorrectCount(0);
        setAttemptCount(0);
        answeredStepRef.current = {};
      } catch (e) {
        console.error("[Lesson] load failed:", e);
        navigate("/dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lessonId, navigate]);

  const lessonKey = useMemo(
    () => (lesson ? resolveLessonIdentifier(lesson) : ""),
    [lesson]
  );

  const steps: StepSpec[] = useMemo(() => {
    if (!lesson) return [];

    const out: StepSpec[] = [];

    if (lesson.flashcards?.length) {
      out.push({
        key: "flips",
        graded: true,
        comp: (on) => (
          <FlipsC
            onResult={on}
            cards={lesson.flashcards.map((f: string, i: number) => ({
              id: i,
              front: f,
            }))}
            correctCardId={0}
          />
        ),
      });
    }

    lesson.exercises?.forEach((ex: any, i: number) => {
      if (ex.type === "connectTheDots") {
        out.push({
          key: `dots-${i}`,
          graded: true,
          comp: (on) => (
            <DotsC
              onResult={on}
              pairs={(ex.items || []).map((s: string) => {
                const [hiragana, katakana] = String(s).split("/");
                return { hiragana, katakana };
              })}
            />
          ),
        });
      }

      if (ex.type === "matchAudioLetter") {
        out.push({
          key: `audio-${i}`,
          graded: true,
          comp: (on) => (
            <AudioC
              onResult={on}
              options={ex.items || []}
              correctAnswer={ex.correctAnswers?.[0]}
            />
          ),
        });
      }

      if (ex.type === "vocabulary_drag_drop") {
        out.push({
          key: `drag-${i}`,
          graded: true,
          comp: (on) => (
            <DragC
              onResult={on}
              characterBank={ex.characterBank || []}
              correctAnswer={ex.correctAnswer}
            />
          ),
        });
      }
    });

    if (lesson.funFact) {
      out.push({
        key: "fact",
        graded: false,
        comp: () => <FactC title="Fun Fact" description={lesson.funFact} />,
      });
    }

    if (lesson.achievement) {
      out.push({
        key: "reward",
        graded: false,
        comp: () => (
          <RewardC
            title={lesson.achievement?.title || "Reward"}
            xp={lesson.achievement?.xp || 0}
          />
        ),
      });
    }

    if (lesson.notes) {
      out.push({
        key: "rinfo",
        graded: false,
        comp: () => <RInfoC title="Notes" description={lesson.notes} />,
      });
    }

    return out;
  }, [lesson]);

  // ✅ Clamp step AFTER steps exist
  useEffect(() => {
    if (steps.length > 0) {
      setStep((prev) => Math.min(prev, steps.length - 1));
    }
  }, [steps.length]);

  const saveLessonProgress = async (
    nextStep: number,
    status: "in_progress" | "completed"
  ) => {
    if (!isAuthed() || !lessonKey) return;

    const accuracyPct =
      attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0;

    await upsertProgress({
      lessonId: lessonKey,
      status,
      lastStep: nextStep,
      accuracyPct,
    });
  };

  function advance(stepKey: string, result: "correct" | "incorrect") {
    if (answeredStepRef.current[stepKey]) return;
    answeredStepRef.current[stepKey] = true;

    const nextAttemptCount = attemptCount + 1;
    const nextCorrectCount =
      result === "correct" ? correctCount + 1 : correctCount;

    setAttemptCount(nextAttemptCount);
    if (result === "correct") setCorrectCount(nextCorrectCount);

    const next = step + 1;

    if (next < steps.length) {
      setStep(next);
      void saveLessonProgress(next, "in_progress");
    } else {
      void saveLessonProgress(step, "completed").finally(() =>
        navigate("/dashboard")
      );
    }
  }

  const onExerciseResult: ResultCb = ({ result }) => {
    const current = steps[step];
    if (!current) return;

    if (current.graded) {
      advance(current.key, result);
      return;
    }

    const next = step + 1;

    if (next < steps.length) {
      setStep(next);
      void saveLessonProgress(next, "in_progress");
    } else {
      void saveLessonProgress(step, "completed").finally(() =>
        navigate("/dashboard")
      );
    }
  };

  const handleSaveAndExit = async () => {
    try {
      setSavingExit(true);
      await saveLessonProgress(step, "in_progress");
    } catch (e) {
      console.error("[Lesson] Save & Exit failed:", e);
    } finally {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson || steps.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Typography>No lesson content found.</Typography>
      </Box>
    );
  }

  const currentStep = steps[step];
  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Button onClick={() => navigate("/dashboard")}>Back</Button>
          <Button onClick={handleSaveAndExit}>
            {savingExit ? "Saving..." : "Save & Exit"}
          </Button>
        </Stack>

        <Chip label={lesson.title} />
        <LinearProgress value={progressPct} variant="determinate" sx={{ my: 2 }} />

        <Box mb={3}>
          {currentStep ? currentStep.comp(onExerciseResult) : "Invalid step"}
        </Box>
      </Paper>
    </Container>
  );
};

export default Lesson;