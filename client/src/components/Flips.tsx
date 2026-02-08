import React, { useMemo, useRef, useState } from "react";
import { Box, Grid, IconButton, Button, useMediaQuery, useTheme, Typography } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type CardData = { id: number; front: string; back: string; audio?: string };

type FlipsProps = {
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
  prompt?: string;

  /** which card id is the correct answer (must match cards[].id) */
  correctCardId?: number;

  cards?: CardData[];
};

const defaultCards: CardData[] = [
  { id: 0, front: "あ/ア", back: "Looks like an apple" },
  { id: 1, front: "い/イ", back: "Looks like an ear" },
  { id: 2, front: "う/ウ", back: "Looks like someone being punched" },
];

const Flips: React.FC<FlipsProps> = ({
  onResult,
  prompt = "Flip the cards, then select the correct one.",
  correctCardId = 0,
  cards = defaultCards,
}) => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const answeredRef = useRef(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleFlip = (id: number) => setFlipped((p) => ({ ...p, [id]: !p[id] }));

  const playAudio = (src?: string) => {
    if (!src) return;
    const a = new Audio(src);
    void a.play();
  };

  const allFlipped = useMemo(() => cards.every((c) => flipped[c.id]), [cards, flipped]);

  const selectAnswer = (pickedId: number) => {
    if (answeredRef.current) return;
    answeredRef.current = true;

    const correct = pickedId === correctCardId;

    onResult?.({
      result: correct ? "correct" : "incorrect",
      detail: {
        pickedId,
        correctCardId,
        flippedIds: Object.keys(flipped).map((x) => Number(x)),
      },
    });
  };

  const renderCard = (card: CardData) => {
    const isFlipped = !!flipped[card.id];

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            perspective: "1000px",
            width: isMobile ? "100%" : 250,
            height: 200,
            cursor: "pointer",
          }}
          onClick={() => toggleFlip(card.id)}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ccc",
                borderRadius: 3,
                bgcolor: "#fff",
                boxShadow: 3,
                fontSize: "2.3rem",
                fontWeight: 600,
                userSelect: "none",
              }}
            >
              {card.front}
            </Box>

            {/* Back */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #ccc",
                borderRadius: 3,
                bgcolor: "#fff",
                boxShadow: 3,
                fontSize: "1.05rem",
                fontWeight: 500,
                padding: 1,
                textAlign: "center",
                userSelect: "none",
                transform: "rotateY(180deg)",
              }}
            >
              {card.back}
            </Box>
          </Box>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <IconButton onClick={() => playAudio(card.audio)} title="Play audio" size="small">
            <VolumeUpIcon color="primary" />
          </IconButton>

          <Button
            variant="outlined"
            size="small"
            onClick={() => selectAnswer(card.id)}
            disabled={answeredRef.current || !allFlipped}
          >
            Select
          </Button>
        </Box>
      </Box>
    );
  };

  if (!cards.length) {
    return (
      <Box p={3}>
        <Typography>No cards.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" px={3} py={2} width="100%" maxWidth={900}>
      <Box textAlign="center" mb={2}>
        <Typography fontWeight={700}>{prompt}</Typography>
        <Typography variant="body2" color="text.secondary">
          Flip all cards, then select one.
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {cards.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={4} display="flex" justifyContent="center">
            {renderCard(card)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Flips;
