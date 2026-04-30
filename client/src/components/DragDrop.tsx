import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";

type DragPayload =
  | { source: "bank"; char: string }
  | { source: "drop"; slotIndex: number; char: string };

type DragDropProps = {
  prompt?: string;
  characterBank?: string[];
  correctAnswer?: string;
  audioUrl?: string;
  bankItems?: string[];
  answer?: string[];
  caption?: string;
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
};

const defaultBank = ["あ", "い", "う", "え", "お"];
const defaultAnswerArr = ["あ", "い", "う"];

const DragDrop: React.FC<DragDropProps> = ({
  prompt = "Build the correct word",
  caption = "",
  onResult,
  characterBank,
  correctAnswer,
  audioUrl,
  bankItems,
  answer,
}) => {
  const bank = characterBank ?? bankItems ?? defaultBank;

  const expectedArr = useMemo(() => {
    if (Array.isArray(answer) && answer.length) return answer;
    if (typeof correctAnswer === "string" && correctAnswer.length) return correctAnswer.split("");
    return defaultAnswerArr;
  }, [answer, correctAnswer]);

  const [slots, setSlots] = useState<(string | null)[]>(() => Array(expectedArr.length).fill(null));
  const [checked, setChecked] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSlots(Array(expectedArr.length).fill(null));
    setChecked(false);
    setDragOverIndex(null);
  }, [expectedArr.length]);

  const isComplete = useMemo(() => slots.every((s) => s !== null), [slots]);
  const built = useMemo(() => slots.map((x) => x ?? "").join(""), [slots]);
  const expectedStr = useMemo(() => expectedArr.join(""), [expectedArr]);
  const isCorrect = useMemo(() => isComplete && built === expectedStr, [isComplete, built, expectedStr]);

  // Drag helpers
  const onDragStartBank = (e: React.DragEvent<HTMLDivElement>, char: string) => {
    const payload: DragPayload = { source: "bank", char };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDragStartSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    const char = slots[slotIndex];
    if (!char) return;
    const payload: DragPayload = { source: "drop", slotIndex, char };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const readPayload = (e: React.DragEvent<HTMLDivElement>): DragPayload | null => {
    try {
      const raw = e.dataTransfer.getData("application/json") || JSON.stringify(dragPayloadRef.current);
      return raw ? (JSON.parse(raw) as DragPayload) : null;
    } catch { return null; }
  };

  const onDropSlot = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const payload = readPayload(e);
    if (!payload) return;

    if (payload.source === "bank") {
      // Always overwrite — same item can be placed multiple times
      setSlots((prev) => { const next = [...prev]; next[targetIndex] = payload.char; return next; });
      return;
    }

    if (payload.source === "drop") {
      const from = payload.slotIndex;
      if (from === targetIndex) return;
      setSlots((prev) => {
        const next = [...prev];
        const tmp = next[targetIndex]; // may be null or another char
        next[targetIndex] = payload.char;
        next[from] = tmp; // swap: puts displaced char back, or clears if target was empty
        return next;
      });
    }
  };

  const onDropBank = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const payload = readPayload(e);
    if (!payload || payload.source !== "drop") return;
    // Dragging a slot item back to the bank clears that slot
    setSlots((prev) => { const next = [...prev]; next[payload.slotIndex] = null; return next; });
  };

  const clearSlot = (i: number) => {
    setSlots((prev) => { const next = [...prev]; next[i] = null; return next; });
  };

  const handleCheck = () => {
    setChecked(true);
    onResult?.({ result: built === expectedStr ? "correct" : "incorrect", detail: { slots, built, expected: expectedStr, expectedArr } });
  };

  const reset = () => {
    setSlots(Array(expectedArr.length).fill(null));
    setChecked(false);
    setDragOverIndex(null);
  };

  const play = () => {
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    audio.onended = () => setPlaying(false);
    audio.onerror = () => setPlaying(false);
    audio.currentTime = 0;
    setPlaying(true);
    audio.play().catch(() => setPlaying(false));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 680, mx: "auto", px: { xs: 1, sm: 2 }, display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5 }}>

      {/* Prompt */}
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", sm: "1.1rem" }, color: "#1C1917" }}>
          {prompt}
        </Typography>
        {caption ? (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{caption}</Typography>
        ) : null}
      </Box>

      {/* Image + Audio row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <Box
          sx={{
            width: { xs: 100, sm: 130 },
            height: { xs: 100, sm: 130 },
            borderRadius: "16px",
            bgcolor: "#F3F4F6",
            border: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "2.5rem" }}>🖼️</Typography>
        </Box>

        {audioUrl ? (
          <>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
            <IconButton
              onClick={play}
              disabled={playing}
              sx={{
                width: 52,
                height: 52,
                bgcolor: playing ? "rgba(180,61,32,0.08)" : "#B43D20",
                color: playing ? "#B43D20" : "#fff",
                border: playing ? "2px solid #B43D20" : "none",
                "&:hover": { bgcolor: playing ? "rgba(180,61,32,0.12)" : "#9D351C" },
                "&.Mui-disabled": { bgcolor: "rgba(180,61,32,0.2)", color: "#B43D20" },
                transition: "all 0.2s",
                boxShadow: playing ? "none" : "0 4px 14px rgba(180,61,32,0.35)",
              }}
            >
              {playing ? <GraphicEqRoundedIcon /> : <VolumeUpRoundedIcon />}
            </IconButton>
          </>
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>No audio</Typography>
        )}
      </Box>

      {/* Drop strip */}
      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          p: 1.5,
          borderRadius: "14px",
          bgcolor: "#F9F7F4",
          border: "1px solid rgba(0,0,0,0.08)",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        {slots.map((char, i) => {
          const isOver = dragOverIndex === i;
          const slotCorrect = checked && char != null && expectedArr[i] === char;
          const slotWrong = checked && char != null && expectedArr[i] !== char;

          return (
            <Box
              key={i}
              role="button"
              aria-label={`slot ${i + 1}`}
              draggable={char !== null}
              onDragStart={(e) => onDragStartSlot(e, i)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i); }}
              onDrop={(e) => onDropSlot(e, i)}
              onDragLeave={() => setDragOverIndex(null)}
              onDoubleClick={() => clearSlot(i)}
              sx={{
                width: { xs: 52, sm: 62 },
                height: { xs: 52, sm: 62 },
                borderRadius: "12px",
                border: `2px ${char ? "solid" : "dashed"} ${
                  isOver ? "#60A5FA" : slotCorrect ? "#059669" : slotWrong ? "#DC2626" : char ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.2)"
                }`,
                bgcolor: slotCorrect ? "rgba(5,150,105,0.06)" : slotWrong ? "rgba(220,38,38,0.06)" : isOver ? "rgba(96,165,250,0.08)" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                cursor: char ? "grab" : "default",
                userSelect: "none",
                transition: "border-color 0.2s, background-color 0.2s",
                boxShadow: isOver ? "0 0 0 4px rgba(96,165,250,0.2)" : "none",
                color: slotCorrect ? "#065F46" : slotWrong ? "#7F1D1D" : "inherit",
              }}
            >
              {char ?? ""}
            </Box>
          );
        })}
      </Box>

      {/* Built word display */}
      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
        {built.length ? `→ ${built}` : "Drag characters into the slots above"}
      </Typography>

      {/* Bank */}
      <Box
        sx={{
          display: "flex",
          gap: 1.25,
          p: 1.5,
          borderRadius: "14px",
          bgcolor: "#F9F7F4",
          border: "1px solid rgba(0,0,0,0.08)",
          minHeight: 76,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropBank}
      >
        {bank.map((char, idx) => (
          <Box
            key={`${char}-${idx}`}
            draggable
            onDragStart={(e) => onDragStartBank(e, char)}
            title="Drag to a slot"
            sx={{
              width: { xs: 52, sm: 62 },
              height: { xs: 52, sm: 62 },
              border: "2px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
              cursor: "grab",
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
              userSelect: "none",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderColor: "#B43D20" },
            }}
          >
            {char}
          </Box>
        ))}
      </Box>

      {/* Controls */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
        <Box
          component="button"
          onClick={handleCheck}
          disabled={!isComplete}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: 999,
            border: "none",
            bgcolor: isComplete ? "#B43D20" : "rgba(0,0,0,0.08)",
            color: isComplete ? "#fff" : "rgba(0,0,0,0.35)",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: isComplete ? "pointer" : "default",
            transition: "all 0.2s",
            boxShadow: isComplete ? "0 4px 14px rgba(180,61,32,0.35)" : "none",
            "&:hover": isComplete ? { bgcolor: "#9D351C" } : {},
          }}
        >
          Check
        </Box>
        <Box
          component="button"
          onClick={reset}
          sx={{
            px: 3,
            py: 1.25,
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.15)",
            bgcolor: "#fff",
            color: "#6B7280",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#F9F7F4" },
          }}
        >
          Reset
        </Box>
      </Box>

      {/* Feedback */}
      {checked && (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: isCorrect ? "#059669" : "#DC2626",
          }}
        >
          {isCorrect ? "✓ Correct!" : "✗ Not quite — try again."}
        </Typography>
      )}
    </Box>
  );
};

export default DragDrop;