import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export type DotMatchPair = { hiragana: string; katakana: string };

type Connection = {
  dot1Id: string; // "L1", "R2" etc.
  dot2Id: string;
};

type DotMatchProps = {
  pairs: DotMatchPair[];
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
};

const DotMatch: React.FC<DotMatchProps> = ({ pairs, onResult }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [firstId, setFirstId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);

  const leftLabels = useMemo(() => pairs.map((p) => p.hiragana), [pairs]);
  const rightLabels = useMemo(() => pairs.map((p) => p.katakana), [pairs]);

  // Redraw lines whenever connections or window size changes
  const drawAllLines = (currentConnections: Connection[]) => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    // Clear existing lines
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const containerRect = container.getBoundingClientRect();

    currentConnections.forEach(({ dot1Id, dot2Id }) => {
      const el1 = dotRefs.current[dot1Id];
      const el2 = dotRefs.current[dot2Id];
      if (!el1 || !el2) return;

      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();

      const x1 = r1.left - containerRect.left + r1.width / 2;
      const y1 = r1.top - containerRect.top + r1.height / 2;
      const x2 = r2.left - containerRect.left + r2.width / 2;
      const y2 = r2.top - containerRect.top + r2.height / 2;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(x1));
      line.setAttribute("y1", String(y1));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
      line.setAttribute("stroke", "#2c3e50");
      line.setAttribute("stroke-width", "3");
      line.setAttribute("stroke-linecap", "round");
      // FIX: "stroke" means only the visible stroke area is clickable, not the bounding box
      line.setAttribute("pointer-events", "stroke");
      line.style.cursor = "pointer";

      line.addEventListener("click", () => {
        setConnections((prev) => {
          const next = prev.filter(
            (c) =>
              !(
                (c.dot1Id === dot1Id && c.dot2Id === dot2Id) ||
                (c.dot1Id === dot2Id && c.dot2Id === dot1Id)
              )
          );
          drawAllLines(next);
          return next;
        });
      });

      svg.appendChild(line);
    });
  };

  useEffect(() => {
    drawAllLines(connections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  useEffect(() => {
    const handler = () => drawAllLines(connections);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  const isConnected = (id: string) =>
    connections.some((c) => c.dot1Id === id || c.dot2Id === id);

  const handleDotClick = (id: string) => {
    if (isConnected(id)) return;

    if (!firstId) {
      setFirstId(id);
      return;
    }

    if (id === firstId) {
      setFirstId(null);
      return;
    }

    // Must connect left (L) to right (R)
    const firstIsLeft = firstId.startsWith("L");
    const thisIsLeft = id.startsWith("L");

    if (firstIsLeft === thisIsLeft) {
      // Same side — cancel selection
      setFirstId(null);
      return;
    }

    const leftId = firstIsLeft ? firstId : id;
    const rightId = firstIsLeft ? id : firstId;

    setConnections((prev) => [...prev, { dot1Id: leftId, dot2Id: rightId }]);
    setFirstId(null);
  };

  const canCheck =
    connections.length === leftLabels.length && leftLabels.length > 0;

  const handleCheck = () => {
    const made = new Set(
      connections.map((c) => `${c.dot1Id}-${c.dot2Id}`)
    );
    const expected = new Set(
      leftLabels.map((_, i) => `L${i + 1}-R${i + 1}`)
    );
    const allCorrect =
      expected.size === made.size &&
      [...expected].every((k) => made.has(k));

    onResult?.({
      result: allCorrect ? "correct" : "incorrect",
      detail: { made: [...made], expected: [...expected] },
    });
  };

  const handleReset = () => {
    setConnections([]);
    setFirstId(null);
  };

  return (
    <Box
      sx={{
        fontFamily: "Arial, sans-serif",
        p: { xs: 1, sm: 2 },
        textAlign: "center",
        bgcolor: "white",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={2}>
        Connect the dots to the corresponding character
      </Typography>

      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: { xs: "95%", sm: "80%" },
          maxWidth: 480,
          height: { xs: pairs.length * 90, sm: pairs.length * 100 },
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          // FIX: overflow visible so lines drawn to edge aren't clipped
          overflow: "visible",
        }}
      >
        {/* FIX: SVG no longer has pointerEvents:none — lines need to be clickable.
            The SVG has no background fill so clicks "through" it land on dots beneath. */}
        <svg
          ref={svgRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            // Do NOT set pointerEvents: "none" here — lines need click events
          }}
        />

        {/* Left column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
            zIndex: 2,
            gap: 1,
          }}
        >
          {leftLabels.map((label, i) => {
            const id = `L${i + 1}`;
            const active = firstId === id;
            const connected = isConnected(id);
            return (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "1.4rem", sm: "1.8rem" },
                    bgcolor: "white",
                  }}
                >
                  {label}
                </Box>
                <Box
                  ref={(el) => {
                    dotRefs.current[id] = el as HTMLDivElement | null;
                  }}
                  onClick={() => handleDotClick(id)}
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: active
                      ? "#e74c3c"
                      : connected
                      ? "#3498db"
                      : "#2c3e50",
                    cursor: connected ? "default" : "pointer",
                    flexShrink: 0,
                    transition: "background-color 150ms ease",
                    zIndex: 3,
                  }}
                />
              </Box>
            );
          })}
        </Box>

        {/* Right column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
            zIndex: 2,
            gap: 1,
          }}
        >
          {rightLabels.map((label, i) => {
            const id = `R${i + 1}`;
            const active = firstId === id;
            const connected = isConnected(id);
            return (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  ref={(el) => {
                    dotRefs.current[id] = el as HTMLDivElement | null;
                  }}
                  onClick={() => handleDotClick(id)}
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: active
                      ? "#e74c3c"
                      : connected
                      ? "#3498db"
                      : "#2c3e50",
                    cursor: connected ? "default" : "pointer",
                    flexShrink: 0,
                    transition: "background-color 150ms ease",
                    zIndex: 3,
                  }}
                />
                <Box
                  sx={{
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    width: { xs: 60, sm: 80 },
                    height: { xs: 60, sm: 80 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "1.4rem", sm: "1.8rem" },
                    bgcolor: "white",
                  }}
                >
                  {label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {firstId && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Selected: {firstId} — now click a dot on the other side
        </Typography>
      )}

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          disabled={!canCheck}
          onClick={handleCheck}
        >
          Check
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default DotMatch;