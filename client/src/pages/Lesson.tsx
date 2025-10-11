// src/pages/Lesson.tsx

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
import { lesson1Data } from "../data/lessonData"; // Import the mock data

const LESSON_ID = lesson1Data.lessonId;

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
}

interface DragDropProps {
  onResult: ResultCb;
  items: any[]; // if your vocab is string[], change to string[]
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

// --- Cast imported components to the prop contracts above (adapter pattern) ---
const FlipsC   = Flips as unknown as React.FC<FlipsProps>;
const AudioC   = AudioMatch as unknown as React.FC<AudioMatchProps>;
const DragC    = DragDrop as unknown as React.FC<DragDropProps>;
const DotsC    = DotMatch as unknown as React.FC<DotMatchProps>;
const FactC    = Fact as unknown as React.FC<FactProps>;
const RewardC  = Reward as unknown as React.FC<RewardProps>;
const RInfoC   = RInfo as unknown as React.FC<RewardInfoProps>;

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  const steps: StepSpec[] = useMemo(
    () => [
      {
        key: "flips",
        graded: true,
        comp: (on) => {
          // Map string[] -> CardData[]
          const cardData: CardData[] = lesson1Data.flashcards.characters.map(
            (char: string, index: number) => ({
              id: index,
              front: char,
              back: "", // put actual "back" if you have one
            })
          );

          // Convert string correctAnswer -> numeric index
          const idx = lesson1Data.flashcards.characters.findIndex(
            (c: string) => c === lesson1Data.flashcards.correctAnswer
          );
          const correctId = idx >= 0 ? idx : 0;

          return (
            <FlipsC onResult={on} cards={cardData} correctCardId={correctId} />
          );
        },
      },
      {
        key: "dotmatch",
        graded: true,
        comp: (on) => (
          <DotsC onResult={on} pairs={lesson1Data.connectTheDots.pairs as DotMatchPair[]} />
        ),
      },
      {
        key: "audio1",
        graded: true,
        comp: (on) => (
          <AudioC
            onResult={on}
            options={lesson1Data.audioMatch1.options}
            correctAnswer={lesson1Data.audioMatch1.correctAnswer}
          />
        ),
      },
      {
        key: "audio2",
        graded: true,
        comp: (on) => (
          <AudioC
            onResult={on}
            options={lesson1Data.audioMatch2.options}
            correctAnswer={lesson1Data.audioMatch2.correctAnswer}
          />
        ),
      },
      {
        key: "audio3",
        graded: true,
        comp: (on) => (
          <AudioC
            onResult={on}
            options={lesson1Data.audioMatch3.options}
            correctAnswer={lesson1Data.audioMatch3.correctAnswer}
          />
        ),
      },
      {
        key: "dragdrop",
        graded: true,
        comp: (on) => (
          <DragC onResult={on} items={lesson1Data.vocab as any[]} />
        ),
      },
      {
        key: "fact",
        graded: false,
        comp: () => (
          <FactC
            title={lesson1Data.funFact.title}
            description={lesson1Data.funFact.description}
          />
        ),
      },
      {
        key: "reward",
        graded: false,
        comp: () => (
          <RewardC
            title={lesson1Data.achievement.title}
            xp={lesson1Data.achievement.xp}
          />
        ),
      },
      {
        key: "rinfo",
        graded: false,
        comp: () => (
          <RInfoC
            title={lesson1Data.souvenir.title}
            description={lesson1Data.souvenir.description}
          />
        ),
      },
    ],
    []
  );

  const pct = Math.round(((step + 1) / steps.length) * 100);
  const accuracy = attemptCount ? Math.round((100 * correctCount) / attemptCount) : 0;

  useEffect(() => {
    if (isAuthed()) {
      void upsertProgress({
        lessonId: LESSON_ID,
        status: "in_progress",
        lastStep: 0,
        accuracyPct: 0,
      });
    }
  }, []);

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
    const nextAccuracy = nextAttemptCount
      ? Math.round((100 * nextCorrectCount) / nextAttemptCount)
      : accuracy;

    setAttemptCount(nextAttemptCount);
    setCorrectCount(nextCorrectCount);

    if (isAuthed() && createAttempt) {
      void submitAttempt({ lessonId: LESSON_ID, stepIndex: step, result, detail });
    }

    if (!isLast) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (isAuthed()) {
        void upsertProgress({
          lessonId: LESSON_ID,
          status: "in_progress",
          lastStep: nextStep,
          accuracyPct: nextAccuracy,
        });
      }
    } else {
      if (isAuthed()) {
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

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 }, maxWidth: 1000, mx: "auto" }}>
      <Stack direction="row" alignItems="center" gap={2} mb={2}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress variant="determinate" value={pct} />
        </Box>
        <Typography variant="body2">{pct}%</Typography>
        <Typography variant="body2" sx={{ ml: 2 }}>
          Acc: {accuracy}%
        </Typography>
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
