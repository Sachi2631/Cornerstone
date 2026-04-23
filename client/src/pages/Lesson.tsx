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

import { submitAttempt, upsertProgress } from "../services/progress";
import { isAuthed, safe } from "../services/api";
import { getLesson, LessonDoc } from "../services/lessons";

type ResultCb = (args: { result: "correct" | "incorrect"; detail?: any }) => void;
type StepSpec = { key: string; graded: boolean; comp: (on: ResultCb) => React.ReactNode };

// ---------- Local prop contracts ----------
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

function stepKeyFromExercise(ex: any, fallbackIndex: number): string {
  return String(ex?.exerciseId || ex?._id || `${String(ex?.type || "exercise")}-${fallbackIndex}`);
}

function stepLabelFromKey(key: string): string {
  if (key === "flips") return "Flashcards";
  if (key === "fact") return "Fun Fact";
  if (key === "reward") return "Reward";
  if (key === "rinfo") return "Notes";
  if (key.includes("connectTheDots")) return "Connect Dots";
  if (key.includes("matchAudioLetter")) return "Audio Match";
  if (key.includes("vocabulary_drag_drop")) return "Drag & Drop";
  return "Exercise";
}

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const lessonId = String(params.lessonId || "");
  console.log("Route param lessonId:", lessonId);

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<LessonDoc | null>(null);

  const [debugOpen, setDebugOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

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

        console.log("[Lesson][debug] lessonId param:", lessonId);
        console.log("[Lesson][debug] raw lesson payload:", l);

        if (!mounted) return;

        setLesson(l);

        setDebugInfo({
          lessonIdParam: lessonId,
          receivedKeys: l ? Object.keys(l as any) : [],
          slug: (l as any)?.slug,
          _id: (l as any)?._id,
          flashcardsLen: ((l as any)?.flashcards || []).length,
          exercisesLen: ((l as any)?.exercises || []).length,
          exerciseTypes: ((l as any)?.exercises || []).map((x: any) => x?.type),
          prefecture: (l as any)?.prefecture,
        });

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

  const steps: StepSpec[] = useMemo(() => {
    if (!lesson) return [];

    const out: StepSpec[] = [];
    const flashcards: string[] = (lesson as any).flashcards || [];

    if (flashcards.length) {
      out.push({
        key: "flips",
        graded: true,
        comp: (on) => {
          const cardData: CardData[] = flashcards.map((raw, idx) => ({
            id: idx,
            front: raw,
            back: "",
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

      console.warn("[Lesson] unknown exercise type:", exType, ex);
    });

    if ((lesson as any).funFact) {
      out.push({
        key: "fact",
        graded: false,
        comp: () => <FactC title="Fun Fact" description={String((lesson as any).funFact || "")} />,
      });
    }

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

  useEffect(() => {
    if (!lesson || !isAuthed() || !lessonKey) return;

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
    if (answeredStepRef.current[stepKey]) return;
    answeredStepRef.current[stepKey] = true;

    const isLast = step >= steps.length - 1;
    const nextAttemptCount = attemptCount + (createAttempt ? 1 : 0);
    const nextCorrectCount =
      nextAttemptCount && createAttempt && result === "correct" ? correctCount + 1 : correctCount;
    const nextAccuracy = nextAttemptCount ? Math.round((100 * nextCorrectCount) / nextAttemptCount) : accuracy;

    setAttemptCount(nextAttemptCount);
    setCorrectCount(nextCorrectCount);

    if (lesson && isAuthed() && createAttempt && lessonKey) {
      void submitAttempt({ lessonId: lessonKey, stepIndex: step, result, detail });
    }

    if (!isLast) {
      const nextStep = step + 1;
      setStep(nextStep);

      if (lesson && isAuthed() && lessonKey) {
        void upsertProgress({
          lessonId: lessonKey,
          status: "in_progress",
          lastStep: nextStep,
          accuracyPct: nextAccuracy,
        });
      }
    } else if (lesson && isAuthed() && lessonKey) {
      void upsertProgress({
        lessonId: lessonKey,
        status: "completed",
        lastStep: step,
        accuracyPct: nextAccuracy,
      });
      navigate("/dashboard");
    }
  }

  const handleResult = (args: { result: "correct" | "incorrect"; detail?: any }) => {
    const k = steps[step]?.key || String(step);
  
    if (args.result === "correct") {
      // ✅ Delay before advancing
      setTimeout(() => {
        advance({ ...args, createAttempt: true, stepKey: k });
      }, 1000); // tweak: 500–1000ms feels nice
    } else {
      // ❌ Delay before reset
      setTimeout(() => {
        setAttemptCount((c) => c + 1);
      }, 700);
  
      if (lesson && isAuthed() && lessonKey) {
        void submitAttempt({
          lessonId: lessonKey,
          stepIndex: step,
          result: "incorrect",
          detail: args.detail,
        });
      }
    }
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

  const handleBack = () => {
    const prevStep = Math.max(0, step - 1);
    const prevKey = steps[prevStep]?.key;
    if (prevKey) delete answeredStepRef.current[prevKey];
    setStep(prevStep);
  };

  // ---------- UI states ----------
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#f7f7fb" }}>
        <Stack alignItems="center" gap={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading lesson…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!lesson || !steps.length) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#f7f7fb", px: 2 }}>
        <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 520, width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Lesson unavailable
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            The lesson may be inactive or missing.
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  const activeKey = steps[step]?.key || String(step);
  const activeLabel = stepLabelFromKey(activeKey);
  const isLast = step >= steps.length - 1;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f7fb",
        backgroundImage:
          "radial-gradient(1200px 600px at 20% 10%, rgba(180,61,32,0.12), transparent 55%), radial-gradient(900px 500px at 90% 20%, rgba(33,150,243,0.12), transparent 55%)",
        pb: { xs: 10, md: 6 },
      }}
    >
      {/* Top chrome */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(247,247,251,0.75)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="md" sx={{ py: 1.5 }}>
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            <Button startIcon={<ArrowBackIcon />} variant="text" onClick={() => navigate("/dashboard")} sx={{ fontWeight: 700 }}>
              Dashboard
            </Button>

            <Box sx={{ flexGrow: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                {getLessonHeader(lesson)}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
                <Chip size="small" label={`${activeLabel} • ${step + 1}/${steps.length}`} />
                <Chip size="small" color="default" label={`Acc ${accuracy}%`} />
                <Chip size="small" color="default" label={`${pct}%`} />
              </Stack>
            </Box>

            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                startIcon={<BugReportIcon />}
                variant="outlined"
                size="small"
                onClick={() => setDebugOpen((v) => !v)}
              >
                {debugOpen ? "Hide Debug" : "Debug"}
              </Button>

              <Button
                startIcon={<ExitToAppIcon />}
                variant="contained"
                onClick={() => navigate("/dashboard")}
                sx={{ bgcolor: "#b43d20", "&:hover": { bgcolor: "#9d351c" } }}
              >
                Save & Exit
              </Button>
            </Stack>

            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 10,
                  borderRadius: 999,
                  bgcolor: "rgba(0,0,0,0.06)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                  },
                }}               />
                </Box>
              </Stack>
    
              {debugOpen && (
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: 2,
                    maxHeight: 220,
                    overflow: "auto",
                    fontFamily: "monospace",
                    fontSize: 12,
                    whiteSpace: "pre-wrap",
                    bgcolor: "rgba(255,255,255,0.75)",
                  }}
                >
                  {JSON.stringify(debugInfo, null, 2)}
                </Paper>
              )}
            </Container>
          </Box>
    
          {/* Main content */}
          <Container maxWidth="md" sx={{ pt: { xs: 2, md: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.08)",
                bgcolor: "rgba(255,255,255,0.75)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
                    {activeLabel}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Step {step + 1} of {steps.length}
                  </Typography>
                </Stack>
    
                <Divider sx={{ my: 2 }} />
    
                {/* Exercise frame */}
                  <Box
                sx={{
                  minHeight: { xs: 420, md: 520 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {steps[step] && React.cloneElement(
                  steps[step].comp(handleResult) as React.ReactElement,
                  { key: `${step}-${attemptCount}` } // forces reset on attempt change
                )}
              </Box>
              </Box>
            </Paper>
          </Container>
    
          {/* Bottom dock (mobile-first) */}
          <Box
            sx={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
              bgcolor: "rgba(255,255,255,0.92)",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Container maxWidth="md" sx={{ py: 1.25 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <Button
                  disabled={step === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ minWidth: 110, borderRadius: 999, fontWeight: 800 }}
                >
                  Back
                </Button>
    
                <Stack direction="row" gap={1}>
                  <Button
                    onClick={handleSkip}
                    color="warning"
                    variant="outlined"
                    sx={{ minWidth: 110, borderRadius: 999, fontWeight: 800 }}
                  >
                    Skip
                  </Button>
    
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    sx={{
                      minWidth: 130,
                      borderRadius: 999,
                      fontWeight: 900,
                      bgcolor: "#b43d20",
                      "&:hover": { bgcolor: "#9d351c" },
                    }}
                  >
                    {isLast ? "Finish" : "Next"}
                  </Button>
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Box>
      );
    };
    
    export default Lesson;