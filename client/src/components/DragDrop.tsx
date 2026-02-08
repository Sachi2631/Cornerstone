import React, { useMemo, useRef, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type DragPayload =
  | { source: "bank"; char: string; bankIndex: number }
  | { source: "drop"; slotIndex: number; char: string };

type DragDropProps = {
  prompt?: string;

  /** NEW (preferred) */
  characterBank?: string[];        // e.g. ["あ","い"]
  correctAnswer?: string;          // e.g. "あい"
  audioUrl?: string;               // optional

  /** Legacy (kept for compatibility) */
  bankItems?: string[];
  answer?: string[];               // array form ["あ","い"]

  caption?: string;
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
};

const defaultBank = ["あ", "い", "う", "え", "お"];
const defaultAnswerArr = ["あ", "い", "う"];

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 900,
    alignItems: "center",
    margin: "40px auto",
    gap: 16,
  },
  header: { margin: 0, fontWeight: 700, fontSize: 18 },
  sub: { margin: 0, color: "#6b7280" },
  mediaRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  dropStrip: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    alignItems: "center",
  },
  slot: {
    width: 64,
    height: 64,
    borderRadius: 10,
    border: "2px dashed #cbd5e1",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    userSelect: "none",
  },
  slotFilled: { borderStyle: "solid", borderColor: "#d1d5db", cursor: "grab" },
  bank: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    minHeight: 88,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  item: {
    padding: 0,
    width: 64,
    height: 64,
    margin: 0,
    border: "2px solid #d1d5db",
    borderRadius: 10,
    cursor: "grab",
    fontSize: 28,
    userSelect: "none",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 1px rgba(0,0,0,.04)",
  },
  controls: { display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" },
  btn: { padding: "10px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontWeight: 700 },
  btnPrimary: { background: "#111827", color: "white", borderColor: "#111827" },
  feedback: { fontSize: 14, minHeight: 22 },
};

const DragDrop: React.FC<DragDropProps> = ({
  prompt = "Build the correct word",
  caption = "",
  onResult,

  // NEW
  characterBank,
  correctAnswer,
  audioUrl,

  // legacy
  bankItems,
  answer,
}) => {
  // Derive bank and expected answer array
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

  const isComplete = useMemo(() => slots.every((s) => s !== null), [slots]);

  const built = useMemo(() => slots.map((x) => x ?? "").join(""), [slots]);
  const expectedStr = useMemo(() => expectedArr.join(""), [expectedArr]);

  const isCorrect = useMemo(() => isComplete && built === expectedStr, [isComplete, built, expectedStr]);

  const onDragStartBank = (e: React.DragEvent<HTMLDivElement>, char: string, bankIndex: number) => {
    const payload: DragPayload = { source: "bank", char, bankIndex };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copyMove";
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
    } catch {
      return null;
    }
  };

  const onDragOverSlot = (e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    setDragOverIndex(slotIndex);
    const payload = readPayload(e);
    if (!payload) return;
    e.dataTransfer.dropEffect =
      payload.source === "drop" || (payload.source === "bank" && slots[slotIndex] === null) ? "move" : "none";
  };

  const onDropSlot = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const payload = readPayload(e);
    if (!payload) return;

    setSlots((prev) => {
      const next = [...prev];

      if (payload.source === "bank") {
        if (next[targetIndex] !== null) return prev;
        next[targetIndex] = payload.char;
        return next;
      }

      if (payload.source === "drop") {
        const from = payload.slotIndex;
        if (from === targetIndex) return prev;
        const movingChar = next[from];
        if (movingChar == null) return prev;

        if (next[targetIndex] === null) {
          next[targetIndex] = movingChar;
          next[from] = null;
        } else {
          const tmp = next[targetIndex];
          next[targetIndex] = movingChar;
          next[from] = tmp;
        }
        return next;
      }

      return prev;
    });
  };

  const onDropBank = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const payload = readPayload(e);
    if (!payload) return;

    if (payload.source === "drop") {
      const from = payload.slotIndex;
      setSlots((prev) => {
        const next = [...prev];
        next[from] = null;
        return next;
      });
    }
  };

  const handleCheck = () => {
    setChecked(true);
    const correctNow = built === expectedStr;
    onResult?.({
      result: correctNow ? "correct" : "incorrect",
      detail: { slots, built, expected: expectedStr, expectedArr },
    });
  };

  const reset = () => {
    setSlots(Array(expectedArr.length).fill(null));
    setChecked(false);
    setDragOverIndex(null);
  };

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

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>{prompt}</h3>
      {caption ? <p style={styles.sub}>{caption}</p> : null}

      <div style={styles.mediaRow}>
        <Box sx={{ height: 180, width: 180, borderStyle: "solid", borderWidth: "1px", borderRadius: "12px" }} />
        {audioUrl ? (
          <>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
            <IconButton sx={{ mt: 1 }} onClick={() => void play()} disabled={playing}>
              <VolumeUpIcon color="primary" />
            </IconButton>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            No audio for this exercise
          </Typography>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 8 }}>
        <div style={styles.dropStrip} onDrop={(e) => e.preventDefault()}>
          {slots.map((char, i) => {
            const isOver = dragOverIndex === i;
            const slotCorrect = char != null && expectedArr[i] === char;

            return (
              <div
                key={i}
                role="button"
                aria-label={`slot ${i + 1}`}
                draggable={char !== null}
                onDragStart={(e) => onDragStartSlot(e, i)}
                onDragOver={(e) => onDragOverSlot(e, i)}
                onDrop={(e) => onDropSlot(e, i)}
                onDragLeave={() => setDragOverIndex(null)}
                onDoubleClick={() =>
                  setSlots((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  })
                }
                style={{
                  ...styles.slot,
                  ...(char ? styles.slotFilled : {}),
                  outline: isOver ? "2px solid #60a5fa" : "none",
                  boxShadow: isOver ? "0 0 0 4px rgba(96,165,250,.25)" : "none",
                  borderColor: checked && char !== null ? (slotCorrect ? "#10b981" : "#ef4444") : (styles.slot as any).borderColor,
                  color: checked && char !== null ? (slotCorrect ? "#065f46" : "#7f1d1d") : "inherit",
                }}
              >
                {char ?? ""}
              </div>
            );
          })}
        </div>

        <Typography variant="body2" color="text.secondary">
          {built.length ? `Built: ${built}` : `Built: —`}
        </Typography>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <div style={styles.bank} onDragOver={(e) => e.preventDefault()} onDrop={onDropBank}>
          {bank.map((char, idx) => (
            <div
              key={`${char}-${idx}`}
              draggable
              onDragStart={(e) => onDragStartBank(e, char, idx)}
              style={styles.item}
              title="Drag to a slot"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.controls}>
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleCheck} disabled={!isComplete}>
          Check
        </button>
        <button style={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>

      <div style={styles.feedback}>
        {checked && (isCorrect ? "✅ Correct!" : "❌ Not quite—keep trying.")}
      </div>
    </div>
  );
};

export default DragDrop;
