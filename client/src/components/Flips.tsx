import React, { useMemo, useRef, useState } from "react";
import { Box, Button, Grid, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type CardData = { id: number; front: string; back?: string; audio?: string };

type FlipsProps = {
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
  prompt?: string;
  correctCardId?: number;
  cards?: CardData[];
};

const defaultCards: CardData[] = [
  { id: 0, front: "あ / ア", back: "Looks like an apple" },
  { id: 1, front: "い / イ", back: "Looks like an ear" },
  { id: 2, front: "う / ウ", back: "Looks like a punch" },
];

const Flips: React.FC<FlipsProps> = ({
  onResult,
  prompt = "Flip each card to review, then select the correct one.",
  correctCardId = 0,
  cards = defaultCards,
}) => {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const answeredRef = useRef(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleFlip = (id: number) => {
    if (answeredRef.current) return;
    setFlipped((p) => ({ ...p, [id]: !p[id] }));
  };

  const playAudio = (src?: string) => {
    if (!src) return;
    new Audio(src).play().catch(() => {});
  };

  const allFlipped = useMemo(() => cards.every((c) => flipped[c.id]), [cards, flipped]);
  const flippedCount = useMemo(() => cards.filter((c) => flipped[c.id]).length, [cards, flipped]);

  const selectAnswer = (pickedId: number) => {
    if (answeredRef.current || !allFlipped) return;
    answeredRef.current = true;
    setSelected(pickedId);
    const correct = pickedId === correctCardId;
    onResult?.({
      result: correct ? "correct" : "incorrect",
      detail: { pickedId, correctCardId, flippedIds: Object.keys(flipped).map(Number) },
    });
  };

  if (!cards.length) return <Box p={3}><Typography>No cards to display.</Typography></Box>;

  return (
    <Box sx={{ width: "100%", maxWidth: 860, mx: "auto", px: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", sm: "1.1rem" }, color: "#1C1917" }}>
          {prompt}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.75, color: "text.secondary" }}>
          {allFlipped
            ? "All flipped! Select the one you want."
            : `${flippedCount} / ${cards.length} flipped — keep going.`}
        </Typography>

        {/* Mini progress pips */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mt: 1.5 }}>
          {cards.map((c) => (
            <Box
              key={c.id}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: flipped[c.id] ? "#B43D20" : "rgba(0,0,0,0.12)",
                transition: "background-color 0.3s",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5 }} justifyContent="center">
        {cards.map((card) => {
          const isFlipped = !!flipped[card.id];
          const backContent = card.back || card.front;
          const isSelected = selected === card.id;
          const isCorrectCard = card.id === correctCardId;
          const showResult = selected !== null;

          let borderColor = "rgba(0,0,0,0.1)";
          if (showResult && isSelected) borderColor = isCorrectCard ? "#059669" : "#DC2626";
          if (showResult && !isSelected && isCorrectCard) borderColor = "#059669";

          return (
            <Grid item key={card.id} xs={12} sm={6} md={4} display="flex" justifyContent="center">
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, width: "100%" }}>

                {/* Flip card */}
                <Box
                  onClick={() => toggleFlip(card.id)}
                  sx={{
                    perspective: "1000px",
                    width: isMobile ? "100%" : 220,
                    maxWidth: 260,
                    height: 180,
                    cursor: answeredRef.current ? "default" : "pointer",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front face */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        border: `2px solid ${borderColor}`,
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        userSelect: "none",
                        transition: "border-color 0.3s, box-shadow 0.2s",
                        "&:hover": answeredRef.current ? {} : { boxShadow: "0 4px 20px rgba(0,0,0,0.13)" },
                      }}
                    >
                      <Typography sx={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {card.front}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.65rem" }}>
                        Tap to flip
                      </Typography>
                    </Box>

                    {/* Back face */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #B43D20",
                        borderRadius: "16px",
                        bgcolor: "rgba(180,61,32,0.04)",
                        boxShadow: "0 2px 12px rgba(180,61,32,0.12)",
                        fontSize: backContent.length > 24 ? "0.9rem" : "1.05rem",
                        fontWeight: 600,
                        px: 2.5,
                        textAlign: "center",
                        userSelect: "none",
                        transform: "rotateY(180deg)",
                        color: "#1C1917",
                        lineHeight: 1.4,
                      }}
                    >
                      {backContent}
                    </Box>
                  </Box>
                </Box>

                {/* Select button / result indicator */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {card.audio && (
                    <IconButton size="small" onClick={() => playAudio(card.audio)} sx={{ color: "#B43D20" }}>
                      <VolumeUpIcon fontSize="small" />
                    </IconButton>
                  )}

                  {showResult && isCorrectCard ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#059669" }}>
                      <CheckCircleRoundedIcon fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Correct</Typography>
                    </Box>
                  ) : (
                    <Button
                      variant={isSelected ? "contained" : "outlined"}
                      size="small"
                      onClick={() => selectAnswer(card.id)}
                      disabled={!allFlipped || answeredRef.current}
                      sx={{
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        px: 2,
                        ...(isSelected && !isCorrectCard && { bgcolor: "#DC2626", borderColor: "#DC2626", "&:hover": { bgcolor: "#B91C1C" } }),
                        ...(!answeredRef.current && allFlipped && { borderColor: "#B43D20", color: "#B43D20", "&:hover": { bgcolor: "rgba(180,61,32,0.06)" } }),
                      }}
                    >
                      Select
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Flips;