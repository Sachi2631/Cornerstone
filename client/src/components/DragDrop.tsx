import React, { useMemo, useRef, useState } from "react";

type DragSource = "bank" | "drop";
type DragPayload =
  | { source: "bank"; char: string; bankIndex: number }
  | { source: "drop"; slotIndex: number; char: string };

type Props = {
  prompt?: string;
  hintImageSrc?: string;
  audioIconSrc?: string;
  /** Characters available in the bank (order shown as given) */
  bankItems?: string[];
  /** The correct answer in order; also controls number of slots */
  answer?: string[];
  /** Optional label under images */
  caption?: string;
};

const defaultBank = ["あ", "い", "う", "え", "お"];
const defaultAnswer = ["あ", "い", "う"]; // 3 slots by default

const styles: { [k: string]: React.CSSProperties } = {
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
  header: { margin: 0, fontWeight: 600 },
  sub: { margin: 0, color: "#6b7280" },
  mediaRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  image: {
    width: 160,
    height: "auto",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,.08)",
  },
  dropStrip: {
    display: "flex",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
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
  slotFilled: {
    borderStyle: "solid",
    borderColor: "#d1d5db",
    cursor: "grab",
  },
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
  row: { display: "flex", flexDirection: "column", gap: 8, width: "100%" },
  rowLabel: { textAlign: "left", fontSize: 14, color: "#6b7280" },
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
    fontWeight: 600,
  },
  btnPrimary: {
    background: "#111827",
    color: "white",
    borderColor: "#111827",
  },
  feedback: { fontSize: 14, minHeight: 22 },
};

const DragDrop: React.FC<Props> = ({
  prompt = "Type the letters according to what you hear",
  hintImageSrc = "img.jpg",
  audioIconSrc = "audio.jpg",
  bankItems = defaultBank,
  answer = defaultAnswer,
  caption = "",
}) => {
  // Slots are controlled by `answer.length`
  const [slots, setSlots] = useState<(string | null)[]>(
    () => Array(answer.length).fill(null)
  );
  const [checked, setChecked] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragPayloadRef = useRef<DragPayload | null>(null);

  const isComplete = useMemo(() => slots.every((s) => s !== null), [slots]);
  const isCorrect = useMemo(
    () =>
      isComplete &&
      slots.every((char, i) => (char ?? "") === (answer[i] ?? "")),
    [isComplete, slots, answer]
  );

  const reset = () => {
    setSlots(Array(answer.length).fill(null));
    setChecked(false);
    setDragOverIndex(null);
  };

  // --- Drag helpers
  const onDragStartBank = (
    e: React.DragEvent<HTMLDivElement>,
    char: string,
    bankIndex: number
  ) => {
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
    if (!char) return;
    const payload: DragPayload = { source: "drop", slotIndex, char };
    dragPayloadRef.current = payload;
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverSlot = (
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number
  ) => {
    e.preventDefault();
    setDragOverIndex(slotIndex);
    const payload = readPayload(e);
    if (!payload) return;
    // Only allow drop if slot is empty OR we're moving into another slot
    e.dataTransfer.dropEffect =
      payload.source === "drop" ||
      (payload.source === "bank" && slots[slotIndex] === null)
        ? "move"
        : "none";
  };

  const onDragLeaveSlot = () => setDragOverIndex(null);

  const onDropSlot = (
    e: React.DragEvent<HTMLDivElement>,
    targetIndex: number
  ) => {
    e.preventDefault();
    setDragOverIndex(null);
    const payload = readPayload(e);
    if (!payload) return;

    setSlots((prev) => {
      const next = [...prev];

      if (payload.source === "bank") {
        // Only place if empty
        if (next[targetIndex] !== null) return prev;
        next[targetIndex] = payload.char;
        return next;
      }

      // Moving within slots: swap/insert
      if (payload.source === "drop") {
        const from = payload.slotIndex;
        if (from === targetIndex) return prev;

        const movingChar = next[from];
        if (movingChar == null) return prev;

        // If target empty: move char
        if (next[targetIndex] === null) {
          next[targetIndex] = movingChar;
          next[from] = null;
        } else {
          // Target filled: swap
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

    // Only meaningful if a slot item is dropped back to bank → remove from slot
    if (payload.source === "drop") {
      const from = payload.slotIndex;
      setSlots((prev) => {
        const next = [...prev];
        next[from] = null;
        return next;
      });
    }
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

  const handleCheck = () => setChecked(true);

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>{prompt}</h3>
      {caption ? <p style={styles.sub}>{caption}</p> : null}

      <div style={styles.mediaRow}>
        <img src={hintImageSrc} alt="Visual hint" style={styles.image} />
        <img src={audioIconSrc} alt="Audio icon" style={styles.image} />
      </div>

      <div style={{ ...styles.row, marginTop: 8 }}>
        <div style={styles.rowLabel}>Your answer</div>
        <div style={styles.dropStrip} onDrop={(e) => e.preventDefault()}>
          {slots.map((char, i) => {
            const isOver = dragOverIndex === i;
            const correct =
              checked && char !== null ? char === answer[i] : undefined;

            return (
              <div
                key={i}
                role="button"
                aria-label={`slot ${i + 1}`}
                draggable={char !== null}
                onDragStart={(e) => onDragStartSlot(e, i)}
                onDragOver={(e) => onDragOverSlot(e, i)}
                onDragLeave={onDragLeaveSlot}
                onDrop={(e) => onDropSlot(e, i)}
                onDoubleClick={() =>
                  // quick remove with double click
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
                  borderColor:
                    checked && char !== null
                      ? correct
                        ? "#10b981"
                        : "#ef4444"
                      : (styles.slot as any).borderColor,
                  color:
                    checked && char !== null
                      ? correct
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
      </div>

      <div style={styles.row}>
        <div style={styles.rowLabel}>Letter bank (drag onto a slot)</div>
        <div
          style={styles.bank}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropBank}
        >
          {bankItems.map((char, idx) => (
            <div
              key={`${char}-${idx}`}
              className="item"
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
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleCheck}>
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
