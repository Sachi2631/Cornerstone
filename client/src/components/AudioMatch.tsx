import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

type AudioMatchProps = { onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void };

const AudioMatch: React.FC<AudioMatchProps> = ({ onResult }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const choices = useMemo(() => ["あ", "い", "う"], []);
  const correct = "あ"; // replace with lesson data

  const play = async () => {
    if (!audioRef.current) return;
    try {
      setPlaying(true);
      await audioRef.current.play();
    } finally {
      setPlaying(false);
    }
  };

  const choose = (label: string) => {
    onResult?.({ result: label === correct ? "correct" : "incorrect", detail: { choice: label } });
  };

  return (
    <Box textAlign="center">
      <Typography variant="h6" mb={2}>
        Listen and choose the right character
      </Typography>
      <audio ref={audioRef} src="/audio/a_sample.mp3" preload="auto" />
      <Button variant="contained" onClick={() => void play()} disabled={playing}>
        Play ▶
      </Button>
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        {choices.map((c) => (
          <Button key={c} variant="outlined" onClick={() => choose(c)}>
            {c}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default AudioMatch;
