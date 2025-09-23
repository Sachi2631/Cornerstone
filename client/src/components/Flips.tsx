import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, IconButton, Button, useMediaQuery, useTheme } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type CardData = { id: number; front: string; back: string; audio?: string };
type Props = {
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
  prompt?: string;
  /** which card is the correct answer */
  correctCardId?: number;
  cards?: CardData[];
};

const defaultCards: CardData[] = [
  { id: 1, front: "あ/ア", back: "Looks like an apple" },
  { id: 2, front: "い/イ", back: "Looks like an ear" },
  { id: 3, front: "う/ウ", back: "Looks like someone being punched" },
];

const Flips = ({
  onResult,
  prompt = "Flip the cards, then select the correct one.",
  correctCardId = 1,
  cards = defaultCards,
}: Props): React.ReactElement => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const answeredRef = useRef(false); // ensure only one submission
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleFlip = (id: number) => {
    setFlipped((p) => ({ ...p, [id]: !p[id] }));
  };

  const playAudio = (src?: string) => {
    if (!src) return;
    const a = new Audio(src);
    void a.play();
  };

  // Optional: auto-enable the "Next" arrow after all have been flipped at least once (no grading)
  const allFlipped = cards.every((c) => flipped[c.id]);

  const selectAnswer = (pickedId: number) => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    const correct = pickedId === correctCardId;
    console.log("[FLIPS] answer selected:", { pickedId, correctCardId, correct });
    onResult?.({
      result: correct ? "correct" : "incorrect",
      detail: { pickedId, correctCardId, flippedIds: Object.keys(flipped) },
    });
  };

  const renderCard = (card: CardData) => (
    <Box
      key={card.id}
      sx={{ perspective: "1000px", width: isMobile ? "100%" : 250, height: 200, cursor: "pointer" }}
      onClick={() => toggleFlip(card.id)}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          transform: flipped[card.id] ? "rotateY(180deg)" : "rotateY(0deg)",
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
            fontWeight: 500,
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
            fontSize: "1.1rem",
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
  );

  return (
    <Box display="flex" flexDirection="column" px={3} py={2} width="100%" maxWidth={900}>
      <Box textAlign="center" mb={2} fontWeight={600}>
        {prompt}
      </Box>

      {/* Top card with controls */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        {renderCard(cards[0])}
        <Box display="flex" gap={1} mt={1}>
          <IconButton onClick={() => playAudio(cards[0].audio)} title="Play audio">
            <VolumeUpIcon color="primary" />
          </IconButton>
          <IconButton disabled={!allFlipped} title="Next hint (ungraded)">
            <ArrowForwardIosIcon color="primary" />
          </IconButton>
        </Box>
        <Button
          sx={{ mt: 1 }}
          variant="outlined"
          onClick={() => selectAnswer(cards[0].id)}
          disabled={answeredRef.current}
        >
          Select
        </Button>
      </Box>

      {/* Bottom cards */}
      <Grid container spacing={2} justifyContent="center">
        {cards.slice(1).map((card) => (
          <Grid item key={card.id}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {renderCard(card)}
              <IconButton sx={{ mt: 1 }} onClick={() => playAudio(card.audio)} title="Play audio">
                <VolumeUpIcon color="primary" />
              </IconButton>
              <Button
                sx={{ mt: 1 }}
                variant="outlined"
                onClick={() => selectAnswer(card.id)}
                disabled={answeredRef.current}
              >
                Select
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Flips;
