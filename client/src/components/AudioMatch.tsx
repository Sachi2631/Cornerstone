import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type ResultCb = (r: { result: "correct" | "incorrect"; detail?: any }) => void;

type AudioMatchProps = {
  onResult?: ResultCb;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
  prompt?: string;
};

const AudioMatch: React.FC<AudioMatchProps> = ({
  onResult,
  options,
  correctAnswer,
  audioUrl,
  prompt,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const choices = useMemo(() => options ?? [], [options]);

  // FIX: playing resets on "ended"/"error", not on play() resolve.
  // audio.play() resolves when playback *starts* — not when it finishes.
  const play = () => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;

    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);

    audio.currentTime = 0;
    setPlaying(true);
    audio.play().catch((e) => {
      console.error("Audio playback failed:", e);
      setPlaying(false);
    });
  };

  const choose = (label: string) => {
    onResult?.({
      result: label === correctAnswer ? "correct" : "incorrect",
      detail: { choice: label, correct: correctAnswer },
    });
  };

  return (
    <Box textAlign="center">
      <Typography variant="h6" mb={2}>
        {prompt || "Listen and choose the right character"}
      </Typography>

      {audioUrl ? (
        <Box mb={2}>
          <audio ref={audioRef} src={audioUrl} preload="auto" />
          <Button
            variant="contained"
            startIcon={<VolumeUpIcon />}
            onClick={play}
            disabled={playing}
          >
            {playing ? "Playing…" : "Play Audio"}
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Audio not available for this exercise.
        </Typography>
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        mt={3}
        flexWrap="wrap"
        useFlexGap
      >
        {choices.map((c) => (
          <Button
            key={c}
            variant="outlined"
            onClick={() => choose(c)}
            sx={{ minWidth: 64, mt: 1, fontSize: "1.3rem" }}
          >
            {c}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default AudioMatch;