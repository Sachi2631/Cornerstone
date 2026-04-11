import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type DragPayload =
  | { source: "bank"; char: string; bankIndex: number }
  | { source: "drop"; slotIndex: number; char: string; bankIndex: number };

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

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "Inter, system-ui, Arial, sans-serif",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 900,
    alignItems: "center",
    margin: "20px auto",
    gap: 16,
    padding: "0 8px",
    boxSizing: "border-box",
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
    flexWrap: "wrap",
    justifyContent: "center",
  },
  slot: {
    width: 56,
    height: 56,
    borderRadius: 10,
    border: "2px dashed #cbd5e1",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
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
    minHeight: 80,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  item: {
    width: 56,
    height: 56,
    border: "2px solid #d1d5db",
    borderRadius: 10,
    cursor: "grab",
    fontSize: 26,
    userSelect: "none",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 1px rgba(0,0,0,.04)",
    transition: "opacity 150ms ease",
  },
  // FIX: used items are visually greyed out and non-interactive
  itemUsed: {
    opacity: 0.3,
    cursor: "default",
    pointerEvents: "none",
  },
  controls: {
    display: "flex",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnPrimary: { background: "#111827", color: "white", borderColor: "#111827" },
  feedback: { fontSize: 14, minHeight: 22 },
};

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
    if (typeof correctAnswer === "string" && correctAnswer.length)
      return correctAnswer.split("");
    return defaultAnswerArr;
  }, [answer, correctAnswer]);

  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array(expectedArr.length).fill(null)
  );
  // FIX: track which bank indices are placed in slots
  const [usedBankIndices, setUsedBankIndices] = useState<Set<number>>(
    () => new Set()
  );
  // FIX: each slot stores the bankIndex it came from so we can return it
  const [slotBankIndices, setSlotBankIndices] = useState<(number | null)[]>(() =>
    Array(expectedArr.length).fill(null)
  );

  const [checked, setChecked] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setSlots(Array(expectedArr.length).fill(null));
    setSlotBankIndices(Array(expectedArr.length).fill(null));
    setUsedBankIndices(new Set());
    setChecked(false);
    setDragOverIndex(null);
  }, [expectedArr.length]);

  const isComplete = useMemo(() => slots.every((s) => s !== null), [slots]);
  const built = useMemo(() => slots.map((x) => x ?? "").join(""), [slots]);
  const expectedStr = useMemo(() => expectedArr.join(""), [expectedArr]);
  const isCorrect = useMemo(
    () => isComplete && built === expectedStr,
    [isComplete, built, expectedStr]
  );

  const onDragStartBank = (
    e: React.DragEvent<HTMLDivElement>,
    char: string,
    bankIndex: number
  ) => {
    if (usedBankIndices.has(bankIndex)) return;
    const payload: DragPayload = { source: "bank", char, bankIndex };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "copyMove";
  };

  const onDragStartSlot = (
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number
  ) => {
    const char = slots[slotIndex];
    const bankIndex = slotBankIndices[slotIndex];
    if (!char || bankIndex === null) return;
    const payload: DragPayload = {
      source: "drop",
      slotIndex,
      char,
      bankIndex,
    };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const readPayload = (
    e: React.DragEvent<HTMLDivElement>
  ): DragPayload | null => {
    try {
      const raw =
        e.dataTransfer.getData("application/json") ||
        JSON.stringify(dragPayloadRef.current);
      return raw ? (JSON.parse(raw) as DragPayload) : null;
    } catch {
      return null;
    }
  };

  const onDragOverSlot = (
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number
  ) => {
    e.preventDefault();
    setDragOverIndex(slotIndex);
  };

  const onDropSlot = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    setDragOverIndex(null);
    const payload = readPayload(e);
    if (!payload) return;

    if (payload.source === "bank") {
      // FIX: don't allow placing if slot is already filled
      if (slots[targetIndex] !== null) return;
      setSlots((prev) => {
        const next = [...prev];
        next[targetIndex] = payload.char;
        return next;
      });
      setSlotBankIndices((prev) => {
        const next = [...prev];
        next[targetIndex] = payload.bankIndex;
        return next;
      });
      // FIX: mark bank index as used
      setUsedBankIndices((prev) => new Set([...prev, payload.bankIndex]));
      return;
    }

    if (payload.source === "drop") {
      const from = payload.slotIndex;
      if (from === targetIndex) return;
      const movingChar = slots[from];
      if (movingChar == null) return;

      setSlots((prev) => {
        const next = [...prev];
        if (next[targetIndex] === null) {
          next[targetIndex] = movingChar;
          next[from] = null;
        } else {
          const tmp = next[targetIndex];
          next[targetIndex] = movingChar;
          next[from] = tmp;
        }
        return next;
      });
      setSlotBankIndices((prev) => {
        const next = [...prev];
        if (next[targetIndex] === null) {
          next[targetIndex] = payload.bankIndex;
          next[from] = null;
        } else {
          const tmp = next[targetIndex];
          next[targetIndex] = payload.bankIndex;
          next[from] = tmp;
        }
        return next;
      });
    }
  };

  const onDropBank = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const payload = readPayload(e);
    if (!payload || payload.source !== "drop") return;

    const from = payload.slotIndex;
    const bankIdx = payload.bankIndex;

    setSlots((prev) => {
      const next = [...prev];
      next[from] = null;
      return next;
    });
    setSlotBankIndices((prev) => {
      const next = [...prev];
      next[from] = null;
      return next;
    });
    // FIX: free the bank index when returned
    setUsedBankIndices((prev) => {
      const next = new Set(prev);
      next.delete(bankIdx);
      return next;
    });
  };

  const handleCheck = () => {
    setChecked(true);
    onResult?.({
      result: built === expectedStr ? "correct" : "incorrect",
      detail: { slots, built, expected: expectedStr, expectedArr },
    });
  };

  const reset = () => {
    setSlots(Array(expectedArr.length).fill(null));
    setSlotBankIndices(Array(expectedArr.length).fill(null));
    setUsedBankIndices(new Set());
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
    audio.play().catch((e) => {
      console.error("Audio playback failed:", e);
      setPlaying(false);
    });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>{prompt}</h3>
      {caption ? <p style={styles.sub}>{caption}</p> : null}

      <div style={styles.mediaRow}>
        <Box
          sx={{
            height: { xs: 120, sm: 160 },
            width: { xs: 120, sm: 160 },
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "12px",
            bgcolor: "#f3f4f6",
          }}
        />
        {audioUrl ? (
          <>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
            <IconButton onClick={play} disabled={playing}>
              <VolumeUpIcon color="primary" />
            </IconButton>
          </>
        ) : (
          <Typography variant="caption" color="text.secondary">
            No audio for this exercise
          </Typography>
        )}
      </div>

      {/* Drop strip */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}
      >
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
                onDoubleClick={() => {
                  const bankIdx = slotBankIndices[i];
                  setSlots((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                  setSlotBankIndices((prev) => {
                    const next = [...prev];
                    next[i] = null;
                    return next;
                  });
                  if (bankIdx !== null) {
                    setUsedBankIndices((prev) => {
                      const next = new Set(prev);
                      next.delete(bankIdx);
                      return next;
                    });
                  }
                }}
                style={{
                  ...styles.slot,
                  ...(char ? styles.slotFilled : {}),
                  outline: isOver ? "2px solid #60a5fa" : "none",
                  boxShadow: isOver ? "0 0 0 4px rgba(96,165,250,.25)" : "none",
                  borderColor:
                    checked && char !== null
                      ? slotCorrect
                        ? "#10b981"
                        : "#ef4444"
                      : (styles.slot as any).borderColor,
                  color:
                    checked && char !== null
                      ? slotCorrect
                        ? "#065f46"
                        : "#7f1d1d"
                      : "inherit",
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

      {/* Bank */}
      <div style={{ width: "100%" }}>
        <div
          style={styles.bank}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropBank}
        >
          {bank.map((char, idx) => {
            const isUsed = usedBankIndices.has(idx);
            return (
              <div
                key={`${char}-${idx}`}
                draggable={!isUsed}
                onDragStart={(e) => onDragStartBank(e, char, idx)}
                style={{
                  ...styles.item,
                  ...(isUsed ? styles.itemUsed : {}),
                }}
                title={isUsed ? "Already placed" : "Drag to a slot"}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.controls}>
        <button
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={handleCheck}
          disabled={!isComplete}
        >
          Check
        </button>
        <button style={styles.btn} onClick={reset}>
          Reset
        </button>
      </div>

      <div style={styles.feedback}>
        {checked && (isCorrect ? "✅ Correct!" : "❌ Not quite — keep trying.")}
      </div>
    </div>
  );
};

export default DragDrop;