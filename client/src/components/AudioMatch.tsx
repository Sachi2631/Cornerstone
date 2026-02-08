import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

type ResultCb = (r: { result: "correct" | "incorrect"; detail?: any }) => void;

type AudioMatchProps = {
  onResult?: ResultCb;
  options: string[];          // choices shown (already normalized, e.g. ["あ","い","う"])
  correctAnswer: string;      // e.g. "あ"
  audioUrl?: string;          // optional
  prompt?: string;            // optional
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

  const play = async () => {
    if (!audioUrl || !audioRef.current) return;
    try {
      setPlaying(true);
      await audioRef.current.play();
    } catch (e) {
      console.error("Audio playback failed:", e);
    } finally {
      setPlaying(false);
    }
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
        <>
          <audio ref={audioRef} src={audioUrl} preload="auto" />
          <Button variant="contained" onClick={() => void play()} disabled={playing}>
            {playing ? "Playing…" : "Play ▶"}
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Audio not available for this exercise.
        </Typography>
      )}

      <Stack direction="row" spacing={2} justifyContent="center" mt={3} flexWrap="wrap">
        {choices.map((c) => (
          <Button key={c} variant="outlined" onClick={() => choose(c)} sx={{ minWidth: 64, mt: 1 }}>
            {c}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default AudioMatch;
