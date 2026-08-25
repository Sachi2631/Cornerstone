"use client";

import React, { useRef, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import Link from "next/link";

import { termAudio, termText } from "@/features/exercises/components/termText";
import SelfRecordButton from "@/features/exercises/components/SelfRecordButton";
import { lessonHref } from "@/lib/content/routes";
import type { Lesson, Term } from "@/payload/payload-types";

const BRAND = "#B43D20";
const SPEEDS = [0.5, 0.75, 1, 1.25] as const;

/*
 * The round "audio button" pattern repeated across CharacterSpotlight,
 * FlashcardReview, MatchDotsMedia and PronunciationExercise — a local copy
 * again rather than a new shared abstraction, consistent with how those do
 * it. Just the circle: the speed control that used to live under it now
 * sits below the whole button row instead (see `TermCard`), so this button
 * lines up with the record button beside it rather than sitting taller.
 */
const AudioButton: React.FC<{ audioUrl?: string; speed: number }> = ({ audioUrl, speed }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAudio = Boolean(audioUrl);

  const playAudio = () => {
    if (!hasAudio || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.playbackRate = speed;
    setPlaying(true);
    audioRef.current.play().catch(() => setPlaying(false));
  };

  return (
    <>
      {hasAudio && (
        <audio ref={audioRef} src={audioUrl} preload="auto" onEnded={() => setPlaying(false)} />
      )}
      <Box
        onClick={playAudio}
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: hasAudio ? BRAND : "rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasAudio ? "pointer" : "default",
          boxShadow: hasAudio ? "0 4px 14px rgba(180,61,32,0.3)" : "none",
          animation: playing ? "termReviewPulse 1.2s ease-in-out infinite" : "none",
          "@keyframes termReviewPulse": {
            "0%,100%": { boxShadow: "0 0 0 0 rgba(180,61,32,0.4)" },
            "50%": { boxShadow: "0 0 0 10px rgba(180,61,32,0)" },
          },
          transition: "box-shadow 0.3s",
        }}
      >
        {playing ? (
          <GraphicEqRoundedIcon sx={{ color: "#fff", fontSize: "1.3rem" }} />
        ) : (
          <VolumeUpRoundedIcon sx={{ color: hasAudio ? "#fff" : "rgba(0,0,0,0.25)", fontSize: "1.3rem" }} />
        )}
      </Box>
    </>
  );
};

/** Applied on the next play — changing it mid-playback would otherwise
 *  require restarting the clip to hear the new rate. */
const SpeedControl: React.FC<{ speed: number; onChange: (s: (typeof SPEEDS)[number]) => void }> = ({
  speed,
  onChange,
}) => (
  <Box sx={{ display: "flex", gap: 0.5 }}>
    {SPEEDS.map((s) => (
      <Box
        key={s}
        onClick={() => onChange(s)}
        sx={{
          px: 0.75,
          py: 0.25,
          borderRadius: "999px",
          fontSize: "0.65rem",
          fontWeight: 700,
          cursor: "pointer",
          color: speed === s ? "#fff" : "text.secondary",
          bgcolor: speed === s ? BRAND : "rgba(0,0,0,0.06)",
          transition: "background-color 0.15s, color 0.15s",
        }}
      >
        {s}x
      </Box>
    ))}
  </Box>
);

const TermCard: React.FC<{ term: Term }> = ({ term }) => {
  const written = termText(term, "plain");
  const reading = termText(term, "reading");
  const meaning = term.meaning?.trim();
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);

  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        bgcolor: "#fff",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>{written}</Typography>

      {reading && reading !== written && (
        <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", fontWeight: 600 }}>
          {reading}
        </Typography>
      )}

      {meaning && (
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{meaning}</Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AudioButton audioUrl={termAudio(term)} speed={speed} />
          <SelfRecordButton />
        </Box>
        <SpeedControl speed={speed} onChange={setSpeed} />
      </Box>
    </Box>
  );
};

const TermReviewPage: React.FC<{ lesson: Lesson; terms: Term[] }> = ({ lesson, terms }) => (
  <Box sx={{ minHeight: "100vh", bgcolor: "#F9F7F4" }}>
    <Container maxWidth="md" sx={{ pt: 5, pb: 8 }}>
      <Box
        component={Link}
        href={lessonHref(lesson.slug)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          mb: 3,
          color: "text.secondary",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "0.9rem",
          "&:hover": { color: BRAND },
        }}
      >
        <ArrowBackRoundedIcon fontSize="small" />
        Back to lesson
      </Box>

      <Typography sx={{ fontWeight: 900, fontSize: { xs: "1.4rem", sm: "1.7rem" }, mb: 0.5 }}>
        {lesson.cardTitle?.trim() || lesson.title}
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        {terms.length
          ? `${terms.length} term${terms.length === 1 ? "" : "s"} from this lesson`
          : "This lesson has no terms to review yet."}
      </Typography>

      {terms.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {terms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </Box>
      )}
    </Container>
  </Box>
);

export default TermReviewPage;
