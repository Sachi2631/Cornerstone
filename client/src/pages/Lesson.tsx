import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Flips from "../components/Flips";
import AudioMatch from "../components/AudioMatch";
import DragDrop from "../components/DragDrop";
import DotMatch from "../components/MatchDots";
import Fact from "../components/Fact";
import Reward from "../components/Rewards";
import RInfo from "../components/RewardInfo";

import { submitAttempt, upsertProgress } from "../services/progress";
import { isAuthed, safe } from "../services/api";

const LESSON_ID = "lesson-1";

type ResultCb = (args: { result: "correct" | "incorrect"; detail?: any }) => void;
type StepSpec = { key: string; graded: boolean; comp: (on: ResultCb) => React.ReactNode };

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  // ---------- steps config (graded vs non-graded) ----------
  const steps: StepSpec[] = useMemo(
    () => [
      { key: "flips",     graded: true,  comp: (on) => <Flips onResult={on} correctCardId={2} /> },
      { key: "audio",     graded: true,  comp: (on) => <AudioMatch onResult={on} /> },
      { key: "dragdrop",  graded: true,  comp: (on) => <DragDrop onResult={on} /> },
      { key: "dotmatch",  graded: true,  comp: (on) => <DotMatch onResult={on} /> },
      { key: "fact",      graded: false, comp: () => <Fact /> },
      { key: "reward",    graded: false, comp: () => <Reward /> },
      { key: "rinfo",     graded: false, comp: () => <RInfo /> },
    ],
    []
  );

  // ---------- progress math ----------
  const pct = Math.round(((step + 1) / steps.length) * 100);
  const accuracy = attemptCount ? Math.round((100 * correctCount) / attemptCount) : 0;

  // ---------- optional: mark lesson started ----------
  useEffect(() => {
    console.log("[LESSON PAGE] mount, authed:", isAuthed());
    if (isAuthed()) {
      void upsertProgress({
        lessonId: LESSON_ID,
        status: "in_progress",
        lastStep: 0,
        accuracyPct: 0,
      });
    }
  }, []);

  // ---------- advance core ----------
  function advance({
    result,
    detail,
    createAttempt,
  }: {
    result: "correct" | "incorrect";
    detail?: any;
    createAttempt: boolean;
  }) {
    const idx = step;
    const current = steps[step];
    const isLast = step >= steps.length - 1;

    console.log("[ADVANCE] from step", step, "key:", current?.key, "graded:", current?.graded, "result:", result, "createAttempt:", createAttempt);

    const nextAttemptCount = attemptCount + (createAttempt ? 1 : 0);
    const nextCorrectCount = correctCount + (createAttempt && result === "correct" ? 1 : 0);
    const nextAccuracy = nextAttemptCount ? Math.round((100 * nextCorrectCount) / nextAttemptCount) : accuracy;

    setAttemptCount(nextAttemptCount);
    setCorrectCount(nextCorrectCount);

    const authed = isAuthed();

    if (authed && createAttempt) {
      console.log("[ADVANCE] will submit attempt");
      void submitAttempt({ lessonId: LESSON_ID, stepIndex: idx, result, detail });
    } else {
      console.log("[ADVANCE] no attempt sent (either not graded or not authed)");
    }

    if (!isLast) {
      const nextStep = step + 1;
      setStep(nextStep);
      console.log("[ADVANCE] move to step", nextStep);

      if (authed) {
        console.log("[ADVANCE] will upsert in_progress progress");
        void upsertProgress({
          lessonId: LESSON_ID,
          status: "in_progress",
          lastStep: nextStep,
          accuracyPct: nextAccuracy,
        });
      } else {
        console.log("[ADVANCE] no progress sent (not authed)");
      }
    } else {
      console.log("[ADVANCE] final step reached; navigating to /dashboard");
      if (authed) {
        console.log("[ADVANCE] will upsert completed progress");
        void upsertProgress({
          lessonId: LESSON_ID,
          status: "completed",
          lastStep: step,
          accuracyPct: nextAccuracy,
        });
      }
      navigate("/dashboard");
    }
  }

  // ---------- handlers ----------
  const handleResult = (args: { result: "correct" | "incorrect"; detail?: any }) => {
    advance({ result: args.result, detail: args.detail, createAttempt: true });
  };

  const handleSkip = safe(async () => {
    const graded = steps[step]?.graded ?? false;
    advance({ result: "incorrect", detail: { skipped: true }, createAttempt: graded });
  });

  const handleNext = () => {
    const graded = steps[step]?.graded ?? false;
    if (graded) {
      advance({ result: "incorrect", detail: { nextOnGraded: true }, createAttempt: true });
    } else {
      advance({ result: "correct", detail: { informational: true }, createAttempt: false });
    }
  };

  // ---- JSX return goes below this line ----


  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1000, mx: "auto" }}>
      <Stack direction="row" alignItems="center" gap={2} mb={2}>
        <Box sx={{ flex: 1 }}><LinearProgress variant="determinate" value={pct} /></Box>
        <Typography variant="body2">{pct}%</Typography>
        <Typography variant="body2" sx={{ ml: 2 }}>Acc: {accuracy}%</Typography>
        <Button variant="text" onClick={() => navigate("/dashboard")}>Save & Exit</Button>
      </Stack>

      <Box sx={{ minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {steps[step]?.comp((r) => void handleResult(r))}
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        <Stack direction="row" gap={1}>
          <Button onClick={handleSkip} color="warning" variant="outlined">Skip</Button>
          <Button onClick={handleNext} variant="contained">Next</Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Lesson;
