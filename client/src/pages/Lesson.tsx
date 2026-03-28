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

import { upsertProgress } from "../services/progress";
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
  return String(lesson.slug || "");
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

            if (typeof progress?.lastStep === "number") {
              savedStep = progress.lastStep;
            }
          } catch (e) {
            console.error("[Lesson] load progress failed:", e);
          }
        }

        setStep(savedStep);
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

  const lessonKey = useMemo(() => (lesson ? resolveLessonIdentifier(lesson) : ""), [lesson]);

  const steps: StepSpec[] = useMemo(() => {
    if (!lesson) return [];

    const out: StepSpec[] = [];

    if (lesson.flashcards?.length) {
      out.push({
        key: "flips",
        graded: true,
        comp: (on: ResultCb) => (
          <FlipsC
            onResult={on}
            cards={lesson.flashcards.map((f: string, i: number) => ({
              id: i,
              front: f,
            }))}
          />
        ),
      });
    }

    lesson.exercises?.forEach((ex: any, i: number) => {
      if (ex.type === "connectTheDots") {
        out.push({
          key: `dots-${i}`,
          graded: true,
          comp: (on: ResultCb) => <DotsC onResult={on} pairs={ex.items} />,
        });
      }

      if (ex.type === "matchAudioLetter") {
        out.push({
          key: `audio-${i}`,
          graded: true,
          comp: (on: ResultCb) => (
            <AudioC
              onResult={on}
              options={ex.items}
              correctAnswer={ex.correctAnswers?.[0]}
            />
          ),
        });
      }

      if (ex.type === "vocabulary_drag_drop") {
        out.push({
          key: `drag-${i}`,
          graded: true,
          comp: (on: ResultCb) => (
            <DragC
              onResult={on}
              characterBank={ex.characterBank}
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
    const nextCorrectCount = result === "correct" ? correctCount + 1 : correctCount;

    setAttemptCount(nextAttemptCount);
    if (result === "correct") setCorrectCount(nextCorrectCount);

    const next = step + 1;

    if (next < steps.length) {
      setStep(next);

      const accuracyPct =
        nextAttemptCount > 0 ? Math.round((nextCorrectCount / nextAttemptCount) * 100) : 0;

      void upsertProgress({
        lessonId: lessonKey,
        status: "in_progress",
        lastStep: next,
        accuracyPct,
      }).catch((e) => {
        console.error("[Lesson] progress save failed:", e);
      });
    } else {
      const accuracyPct =
        nextAttemptCount > 0 ? Math.round((nextCorrectCount / nextAttemptCount) * 100) : 0;

      void upsertProgress({
        lessonId: lessonKey,
        status: "completed",
        lastStep: step,
        accuracyPct,
      })
        .catch((e) => {
          console.error("[Lesson] completion save failed:", e);
        })
        .finally(() => navigate("/dashboard"));
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
      void saveLessonProgress(next, "in_progress").catch((e) =>
        console.error("[Lesson] progress save failed:", e)
      );
    } else {
      void saveLessonProgress(step, "completed")
        .catch((e) => console.error("[Lesson] completion save failed:", e))
        .finally(() => navigate("/dashboard"));
    }
  };

  const handleNextUngraded = async () => {
    const next = step + 1;

    if (next < steps.length) {
      setStep(next);
      try {
        await saveLessonProgress(next, "in_progress");
      } catch (e) {
        console.error("[Lesson] ungraded save failed:", e);
      }
    } else {
      try {
        await saveLessonProgress(step, "completed");
      } catch (e) {
        console.error("[Lesson] final ungraded save failed:", e);
      } finally {
        navigate("/dashboard");
      }
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
  const progressPct = steps.length > 0 ? ((step + 1) / steps.length) * 100 : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </Button>

          <Button
            startIcon={<ExitToAppIcon />}
            variant="contained"
            onClick={handleSaveAndExit}
            disabled={savingExit}
          >
            {savingExit ? "Saving..." : "Save & Exit"}
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <Chip label={lesson.title} />
          <Chip label={`Step ${step + 1} / ${steps.length}`} />
          <Chip label={stepLabelFromKey(currentStep.key)} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{ mb: 3, height: 10, borderRadius: 999 }}
        />

        <Divider sx={{ mb: 3 }} />

        <Box mb={3}>{currentStep.comp(onExerciseResult)}</Box>

        {!currentStep.graded && (
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" onClick={handleNextUngraded}>
              Continue
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1} mt={3} alignItems="center">
          <BugReportIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Accuracy: {attemptCount > 0 ? Math.round((correctCount / attemptCount) * 100) : 0}%
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Lesson;