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
type StepSpec = { key: string; graded: boolean; comp: (on: ResultCb) => React.ReactElement };


// ---------- Component Casts ----------
const FlipsC = Flips as any;
const AudioC = AudioMatch as any;
const DragC = DragDrop as any;
const DotsC = DotMatch as any;
const FactC = Fact as any;
const RewardC = Reward as any;
const RInfoC = RInfo as any;


// ---------- Helpers ----------
function resolveLessonIdentifier(lesson: LessonDoc): string {
 return String((lesson as any).slug || (lesson as any)._id || "");
}


function stepLabelFromKey(key: string): string {
 if (key === "flips") return "Flashcards";
 if (key.includes("connect")) return "Connect Dots";
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


 const [step, setStep] = useState(0);
 const [correctCount, setCorrectCount] = useState(0);
 const [attemptCount, setAttemptCount] = useState(0);


 const answeredStepRef = useRef<Record<string, boolean>>({});


 // ---------- Load lesson + progress ----------
 useEffect(() => {
   let mounted = true;


   (async () => {
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


           if (progress?.lastStep !== undefined) {
             savedStep = progress.lastStep;
           }
         } catch (e) {
           console.error("[Load Progress] failed:", e);
         }
       }


       setStep(savedStep);
       setCorrectCount(0);
       setAttemptCount(0);
       answeredStepRef.current = {};
     } catch (e) {
       console.error(e);
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


 // ---------- Steps ----------
 const steps: StepSpec[] = useMemo(() => {
   if (!lesson) return [];


   const out: StepSpec[] = [];


   if ((lesson as any).flashcards?.length) {
     out.push({
       key: "flips",
       graded: true,
       comp: (on: ResultCb) => (
         <FlipsC onResult={on} cards={(lesson as any).flashcards.map((f: string, i: number) => ({ id: i, front: f }))} />
       ),
     });
   }


   (lesson as any).exercises?.forEach((ex: any, i: number) => {
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
           <AudioC onResult={on} options={ex.items} correctAnswer={ex.correctAnswers?.[0]} />
         ),
       });
     }


     if (ex.type === "vocabulary_drag_drop") {
       out.push({
         key: `drag-${i}`,
         graded: true,
         comp: (on: ResultCb) => (
           <DragC onResult={on} characterBank={ex.characterBank} correctAnswer={ex.correctAnswer} />
         ),
       });
     }
   });


   if ((lesson as any).funFact) {
     out.push({
       key: "fact",
       graded: false,
       comp: () => <FactC title="Fun Fact" description={(lesson as any).funFact} />,
     });
   }


   if ((lesson as any).achievement) {
     out.push({
       key: "reward",
       graded: false,
       comp: () => <RewardC title="Complete!" xp={(lesson as any).achievement?.xp || 0} />,
     });
   }


   return out;
 }, [lesson]);


 // ---------- Advance ----------
 function advance(stepKey: string, result: "correct" | "incorrect") {
   if (answeredStepRef.current[stepKey]) return;
   answeredStepRef.current[stepKey] = true;


   if (result === "correct") setCorrectCount((c) => c + 1);
   setAttemptCount((c) => c + 1);


   const next = step + 1;


   if (next < steps.length) {
     setStep(next);


     if (isAuthed()) {
       upsertProgress({
         lessonId: lessonKey,
         status: "in_progress",
         lastStep: next,
         accuracyPct: 0,
       });
     }
   } else {
     if (isAuthed()) {
       upsertProgress({
         lessonId: lessonKey,
         status: "completed",
         lastStep: step,
         accuracyPct: 0,
       });
     }
     navigate("/dashboard");
   }
 }


 // ---------- Result handler ----------
 const handleResult = (args: { result: "correct" | "incorrect" }) => {
   const key = steps[step]?.key || String(step);


   if (args.result === "correct") {
     setTimeout(() => advance(key, "correct"), 800);
   } else {
     setTimeout(() => setAttemptCount((c) => c + 1), 600);
   }
 };


 // ---------- UI ----------
 if (loading) {
   return <CircularProgress />;
 }


 if (!lesson || !steps.length) {
   return <Typography>No lesson</Typography>;
 }


 const element = steps[step]?.comp(handleResult);


 return (
   <Box>
     <Typography>{stepLabelFromKey(steps[step].key)}</Typography>


     <Box sx={{ minHeight: 400 }}>
       {element &&
         React.cloneElement(element, {
           key: `${step}-${attemptCount}`,
         })}
     </Box>


     <Button
       onClick={async () => {
         if (isAuthed()) {
           await upsertProgress({
             lessonId: lessonKey,
             status: "in_progress",
             lastStep: step,
             accuracyPct: 0,
           });
         }
         navigate("/dashboard");
       }}
     >
       Save & Exit
     </Button>
   </Box>
 );
};


export default Lesson;

