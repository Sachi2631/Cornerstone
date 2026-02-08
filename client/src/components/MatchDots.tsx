import React, { useEffect, useMemo, useRef, useState } from "react";

type DotConnection = { dot1: HTMLElement; dot2: HTMLElement };

export type DotMatchPair = { hiragana: string; katakana: string };

type DotMatchProps = {
  pairs: DotMatchPair[];
  onResult?: (r: { result: "correct" | "incorrect"; detail?: any }) => void;
};

const DotMatch: React.FC<DotMatchProps> = ({ pairs, onResult }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [firstDot, setFirstDot] = useState<HTMLElement | null>(null);
  const [connections, setConnections] = useState<DotConnection[]>([]);

  const leftLabels = useMemo(() => pairs.map((p) => p.hiragana), [pairs]);
  const rightLabels = useMemo(() => pairs.map((p) => p.katakana), [pairs]);

  useEffect(() => {
    const handler = () => redrawLines();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections]);

  const isDotConnected = (dot: HTMLElement) =>
    connections.some((c) => c.dot1 === dot || c.dot2 === dot);

  const handleDotClick = (dot: HTMLElement) => {
    if (isDotConnected(dot)) return;

    if (!firstDot) {
      setFirstDot(dot);
      dot.style.backgroundColor = "#e74c3c";
      return;
    }

    if (dot === firstDot) {
      firstDot.style.backgroundColor = "#000";
      setFirstDot(null);
      return;
    }

    const side1 = firstDot.closest(".dot-column")?.classList.contains("left") ? "left" : "right";
    const side2 = dot.closest(".dot-column")?.classList.contains("left") ? "left" : "right";

    // must connect left to right
    if (side1 === side2) {
      firstDot.style.backgroundColor = "#000";
      setFirstDot(null);
      return;
    }

    drawLine(firstDot, dot);
    setConnections((prev) => [...prev, { dot1: firstDot, dot2: dot }]);
    firstDot.style.backgroundColor = "#000";
    setFirstDot(null);
  };

  const drawLine = (dot1: HTMLElement, dot2: HTMLElement) => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = svgRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const r1 = dot1.getBoundingClientRect();
    const r2 = dot2.getBoundingClientRect();

    const x1 = r1.left - containerRect.left + r1.width / 2;
    const y1 = r1.top - containerRect.top + r1.height / 2;
    const x2 = r2.left - containerRect.left + r2.width / 2;
    const y2 = r2.top - containerRect.top + r2.height / 2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", "#2c3e50");
    line.setAttribute("stroke-width", "2");
    line.style.cursor = "pointer";

    // allow removing by clicking the line
    line.addEventListener("click", () => {
      svg.removeChild(line);
      removeConnection(dot1, dot2);
    });

    svg.appendChild(line);
  };

  const removeConnection = (dot1: HTMLElement, dot2: HTMLElement) => {
    setConnections((prev) =>
      prev.filter(
        (c) =>
          !(
            (c.dot1 === dot1 && c.dot2 === dot2) ||
            (c.dot1 === dot2 && c.dot2 === dot1)
          )
      )
    );
  };

  const redrawLines = () => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    connections.forEach((c) => drawLine(c.dot1, c.dot2));
  };

  // Enforce a deterministic "pair key": left index must match right index
  const keyFor = (a: HTMLElement, b: HTMLElement) => {
    const idA = a.dataset.id!;
    const idB = b.dataset.id!;
    const [l, r] = idA.startsWith("L") ? [idA, idB] : [idB, idA];
    return `${l}-${r}`; // "L1-R1"
  };

  const canCheck = connections.length === leftLabels.length && leftLabels.length > 0;

  const handleCheck = () => {
    const made = new Set(connections.map((c) => keyFor(c.dot1, c.dot2)));

    const expected = new Set(leftLabels.map((_, i) => `L${i + 1}-R${i + 1}`));
    const allCorrect = expected.size === made.size && [...expected].every((k) => made.has(k));

    onResult?.({
      result: allCorrect ? "correct" : "incorrect",
      detail: { made: [...made], expected: [...expected] },
    });
  };

  return (
    <div style={styles.page}>
      <h2 style={{ marginBottom: 20 }}>Connect the dots to the corresponding character</h2>

      <div className="match-container" ref={containerRef} style={styles.matchContainer}>
        <svg ref={svgRef} style={styles.lineCanvas} />

        <div className="dot-column left" style={styles.dotColumn}>
          {leftLabels.map((label, i) => (
            <div key={i} className="labels" style={styles.labels}>
              <h3 style={styles.label}>{label}</h3>
              <div
                className="dot"
                data-id={`L${i + 1}`}
                style={styles.dot}
                onClick={(e) => handleDotClick(e.currentTarget)}
              />
            </div>
          ))}
        </div>

        <div className="dot-column right" style={styles.dotColumn}>
          {rightLabels.map((label, i) => (
            <div key={i} className="labels" style={styles.labels}>
              <div
                className="dot"
                data-id={`R${i + 1}`}
                style={styles.dot}
                onClick={(e) => handleDotClick(e.currentTarget)}
              />
              <h3 style={styles.label}>{label}</h3>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button disabled={!canCheck} onClick={handleCheck} style={{ padding: "8px 14px", borderRadius: 8 }}>
          Check
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: { fontFamily: "Arial, sans-serif", padding: 20, textAlign: "center", backgroundColor: "white" },
  matchContainer: {
    position: "relative",
    width: "80%",
    height: "500px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
    maxWidth: "450px",
  },
  dotColumn: { display: "flex", flexDirection: "column", justifyContent: "space-around", height: "100%", padding: "20px", zIndex: 2 },
  labels: { display: "flex", flexDirection: "row", width: "150px", justifyContent: "space-around", alignItems: "center" },
  label: {
    border: "2px solid #ccc",
    borderRadius: "5px",
    width: "100px",
    height: "100px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    backgroundColor: "white",
  },
  dot: { width: 10, height: 10, backgroundColor: "black", borderRadius: "50%", cursor: "pointer" },
  lineCanvas: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 },
};

export default DotMatch;
