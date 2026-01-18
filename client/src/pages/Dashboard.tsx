// src/pages/Dashboard.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import * as d3 from "d3";
import { createRoot } from "react-dom/client";
import Bart from "../components/Menut";
import { Link } from "react-router-dom";

const Dashboard = (): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.92, 1200);
      const height = width * 0.625;
      setContainerSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = containerSize;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    d3.json("/japan.geojson").then((data: any) => {
      if (!data?.features) return;

      const projection = d3
        .geoMercator()
        .center([67.5, 32.5])
        .scale((width / 1000) * 2200)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      projection.fitExtent(
        [
          [60, 40],
          [width - 20, height - 20],
        ],
        data
      );

      g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", "#b4441d")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5)
        .on("mouseover", function () {
          d3.select(this).attr("fill", "#90caf9");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "#b4441d");
        })
        .on("click", function (event: MouseEvent, d: any) {
          event.stopPropagation();
          const [[x0, y0], [x1, y1]] = path.bounds(d);
          const dx = x1 - x0;
          const dy = y1 - y0;
          const x = (x0 + x1) / 2;
          const y = (y0 + y1) / 2;
          const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
          const translate = [width / 2 - scale * x, height / 2 - scale * y];

          svg
            .transition()
            .duration(900)
            .call(zoom.transform as any, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));

          const name = d.properties?.nam_ja || d.properties?.nam || "Unknown Prefecture";
          setSelectedPrefecture(name);
        });

      data.features.forEach((d: any) => {
        const [x, y] = projection(d3.geoCentroid(d)) || [0, 0];

        const foreignObject = g
          .append("foreignObject")
          .attr("x", x - 10)
          .attr("y", y - 18)
          .attr("width", 30)
          .attr("height", 30)
          .style("pointer-events", "auto")
          .style("cursor", "pointer")
          .on("click", (event) => {
            event.stopPropagation();
            const name = d.properties?.nam_ja || d.properties?.nam || "Unknown Prefecture";
            setPopup({ x, y, name });
          });

        const div = document.createElement("div");
        div.style.width = "20px";
        div.style.height = "30px";
        foreignObject.node()?.appendChild(div);

        const root = createRoot(div);
        root.render(<LocationOnIcon sx={{ fontSize: 20, color: "black" }} />);
      });
    });

    const initialScale = 1.3;
    const initialTranslate = [(width * (1.05 - initialScale)) / 2, (height * (1.125 - initialScale)) / 2];

    svg
      .transition()
      .duration(0)
      .call(zoom.transform as any, d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale));

    svg.on("click", () => {
      svg
        .transition()
        .duration(900)
        .call(zoom.transform as any, d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale));
      setSelectedPrefecture(null);
      setPopup(null);
    });
  }, [containerSize]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#fff",
        overflowX: "hidden", // ✅ kills the 100vw overflow feel
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* MAIN */}
      <Box sx={{ width: "min(1200px, 100%)", mx: "auto" }}>
        {/* MAP AREA */}
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16/11",
            position: "relative",
            border: "1px solid rgba(0,0,0,0.18)",
            borderRadius: "14px",
            overflow: "hidden",
            background: "#dee2e4",
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`200 0 ${containerSize.width} ${containerSize.height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block" }}
          />

          {popup && (
            <Box
              sx={{
                position: "absolute",
                top: popup.y - 50,
                left: popup.x,
                transform: "translate(-50%, -100%)",
                bgcolor: "#d9d9d9",
                borderRadius: "40px",
                padding: "12px",
                boxShadow: 3,
                zIndex: 20,
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "270px",
                paddingTop: "20px",
                paddingBottom: "20px",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: "18px", textAlign: "center" }}>
                Unit 1: Lesson 1
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                あ、い、う
              </Typography>
              <Typography variant="body1" sx={{ textAlign: "center", fontWeight: 200 }}>
                Items Collected
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                {["A", "B", "C"].map((k) => (
                  <Button
                    key={k}
                    sx={{
                      minWidth: 0,
                      padding: 0,
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      border: "1px solid black",
                      overflow: "hidden",
                      marginRight: "5px",
                      marginLeft: "5px",
                    }}
                    onClick={() => alert(`Lesson ${k} for ${popup.name}`)}
                  >
                    <img
                      src="assets/MysteryI.png"
                      alt={`Lesson ${k}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Button>
                ))}
              </Box>

              <Link to={`/Lesson`} style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    height: "40px",
                    width: "160px",
                    borderRadius: "30px",
                    backgroundColor: "#92a6ba",
                    fontWeight: 100,
                    mt: "50px",
                    textTransform: "none",
                    margin: "0 auto",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    "&:hover": { backgroundColor: "#7a92a8" },
                  }}
                >
                  Start Now!
                  <img src="assets/Arrow.png" alt="Lesson" style={{ height: "20px" }} />
                </Button>
              </Link>
            </Box>
          )}

          {/* INFO PANELS (kept, but responsive widths) */}
          <Box
            sx={{
              padding: "20px",
              width: { xs: "88vw", sm: "320px", md: "18vw" },
              maxWidth: 360,
              borderRadius: "14px",
              marginRight: { xs: 1.5, md: "5vw" },
              bgcolor: "#d3d3d3",
              boxShadow: 3,
              zIndex: 1,
              marginTop: "5vh",
              position: "absolute",
              right: 0,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Up next:
            </Typography>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Unit 1 Lesson 1
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 100 }}>
                Goal: Learn the first three letters of the Japanese alphabet
              </Typography>

              <IconButton aria-label="Open Unit 1 Lesson 1" onClick={() => alert("Open Unit 1 Lesson 1")}>
                <PlayCircleFilledIcon sx={{ fontSize: 60, color: "#000" }} />
              </IconButton>

              <Typography variant="body1" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                Grammar Lesson 1
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 100 }}>
                Goal: Learn how to use これ、それ、は
              </Typography>

              <IconButton aria-label="Open Grammar Lesson 1" onClick={() => alert("Open Grammar Lesson 1")}>
                <PlayCircleFilledIcon sx={{ fontSize: 60, color: "#000" }} />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "20px",
              width: { xs: "88vw", sm: "320px", md: "18vw" },
              maxWidth: 360,
              borderRadius: "14px",
              marginRight: { xs: 1.5, md: "5vw" },
              bgcolor: "#d3d3d3",
              boxShadow: 3,
              zIndex: 1,
              position: "absolute",
              right: 0,
              bottom: { xs: 16, md: "6vh" },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 400, mb: 2 }}>
              Stories:
            </Typography>

            <Button
              sx={{
                width: "100%",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#92a6ba",
                fontWeight: 100,
                fontSize: "18px",
                mt: "10px",
                textTransform: "none",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                "&:hover": { backgroundColor: "#7a92a8" },
              }}
            >
              Momotaro
              <img src="assets/Arrow.png" alt="Momotaro" style={{ height: "28px" }} />
            </Button>
          </Box>
        </Box>

        {/* Prefecture name display */}
        <Box
          mt={2}
          minHeight="44px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            opacity: selectedPrefecture ? 1 : 0,
            transform: selectedPrefecture ? "translateY(0)" : "translateY(12px)",
            transition: "all 0.35s ease",
            color: "orange",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {selectedPrefecture && <Typography variant="h6">{selectedPrefecture}</Typography>}
        </Box>

        {/* ✅ MENUT UNDER MAP (embedded, not fixed) */}
        <Box sx={{ mt: 2.5 }}>
          <Bart variant="embedded" title="Quick Menu" />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
