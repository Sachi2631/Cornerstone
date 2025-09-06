import React, { useEffect, useRef, useState } from 'react';


type DotConnection = {
dot1: HTMLElement;
dot2: HTMLElement;
};


const DotMatch: React.FC = () => {
const svgRef = useRef<SVGSVGElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
const [firstDot, setFirstDot] = useState<HTMLElement | null>(null);
const [connections, setConnections] = useState<DotConnection[]>([]);


const leftLabels = ['あ', 'い', 'う'];
const rightLabels = ['イ', 'ウ', 'ア'];


useEffect(() => {
window.addEventListener('resize', redrawLines);
return () => window.removeEventListener('resize', redrawLines);
}, [connections]);


const handleDotClick = (dot: HTMLElement) => {
if (isDotConnected(dot)) return;


if (!firstDot) {
  setFirstDot(dot);
  dot.style.backgroundColor = '#e74c3c';
} else if (dot !== firstDot) {
  const side1 = firstDot.closest('.dot-column')?.classList.contains('left') ? 'left' : 'right';
  const side2 = dot.closest('.dot-column')?.classList.contains('left') ? 'left' : 'right';

  if (side1 === side2) {
    firstDot.style.backgroundColor = '#3498db';
    setFirstDot(null);
    return;
  }

  drawLine(firstDot, dot);
  setConnections(prev => [...prev, { dot1: firstDot, dot2: dot }]);
  firstDot.style.backgroundColor = '#3498db';
  setFirstDot(null);
} else {
  firstDot.style.backgroundColor = '#3498db';
  setFirstDot(null);
}

};


const isDotConnected = (dot: HTMLElement) => {
return connections.some(conn => conn.dot1 === dot || conn.dot2 === dot);
};


const drawLine = (dot1: HTMLElement, dot2: HTMLElement) => {
if (!svgRef.current || !containerRef.current) return;


const svg = svgRef.current;
const containerRect = containerRef.current.getBoundingClientRect();
const dot1Rect = dot1.getBoundingClientRect();
const dot2Rect = dot2.getBoundingClientRect();

const x1 = dot1Rect.left - containerRect.left + dot1Rect.width / 2;
const y1 = dot1Rect.top - containerRect.top + dot1Rect.height / 2;
const x2 = dot2Rect.left - containerRect.left + dot2Rect.width / 2;
const y2 = dot2Rect.top - containerRect.top + dot2Rect.height / 2;

const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
line.setAttribute("x1", x1.toString());
line.setAttribute("y1", y1.toString());
line.setAttribute("x2", x2.toString());
line.setAttribute("y2", y2.toString());
line.setAttribute("stroke", "#2c3e50");
line.setAttribute("stroke-width", "2");
line.style.cursor = "pointer";

line.addEventListener("click", () => {
  svg.removeChild(line);
  removeConnection(dot1, dot2);
});

svg.appendChild(line);

};


const removeConnection = (dot1: HTMLElement, dot2: HTMLElement) => {
setConnections(prev =>
prev.filter(
c =>
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
while (svg.firstChild) {
svg.removeChild(svg.firstChild);
}
connections.forEach(conn => {
drawLine(conn.dot1, conn.dot2);
});
};


return (
<div style={styles.page}>
<h2 style={{ marginBottom: '20px' }}>
Connect the dots to the corresponding character
</h2>
<div className="match-container" ref={containerRef} style={styles.matchContainer}>
<svg id="lineCanvas" ref={svgRef} style={styles.lineCanvas} />


    <div className="dot-column left" style={styles.dotColumn}>
      {leftLabels.map((label, i) => (
        <div key={i} className="labels" style={styles.labels}>
          <h3 style={styles.label}>{label}</h3>
          <div
            className="dot"
            data-id={`L${i + 1}`}
            style={styles.dot}
            onClick={(e) => handleDotClick(e.currentTarget)}
          ></div>
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
          ></div>
          <h3 style={styles.label}>{label}</h3>
        </div>
      ))}
    </div>
  </div>
</div>

);
};


const styles: { [key: string]: React.CSSProperties } = {
  page: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 20,
    textAlign: 'center' as const,
    backgroundColor: 'white',
  },
  matchContainer: {
    position: 'relative',
    width: '80%',
    height: '500px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    maxWidth: '450px',
  },
  dotColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-around',
    height: '100%',
    padding: '20px',
    zIndex: 2,
  },
  labels: {
    display: 'flex',
    flexDirection: 'row' as const,
    width: '150px',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  label: {
    border: '2px solid #ccc',
    borderRadius: '5px',
    width: '100px',
    height: '100px',
    margin:'10px',
    alignItems:'Center',
    display:'flex',
    justifyContent:'space-around',
    fontSize:'2rem',
    
    backgroundColor: 'white',
  },
  dot: {
    width: '7px',
    height: '7px',
    backgroundColor: 'black',
    borderRadius: '50%',
    cursor: 'pointer',
    alignItems:'center',
  },
  lineCanvas: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
  },
};


export default DotMatch;