// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import * as d3 from "d3";
import { createRoot } from "react-dom/client";
import Bart from "../components/Menut";
import { Link } from "react-router-dom";
import { json } from "../services/api";

type Lesson = {
  slug: string;
  title: string;
  version: string;
  flashcards: string[];
  prefecture: string;
};

const Dashboard = (): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null); // display name (geojson)
  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string | null>(null); // canonical (DB)
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);

  const [prefLessons, setPrefLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // ✅ Prefecture normalization map (JP -> canonical DB value)
  const PREF_NAME_TO_CODE = useMemo<Record<string, string>>(
    () => ({
      "北海道": "Hokkaido",
      "青森県": "Aomori",
      "岩手県": "Iwate",
      "宮城県": "Miyagi",
      "秋田県": "Akita",
      "山形県": "Yamagata",
      "福島県": "Fukushima",
      "茨城県": "Ibaraki",
      "栃木県": "Tochigi",
      "群馬県": "Gunma",
      "埼玉県": "Saitama",
      "千葉県": "Chiba",
      "東京都": "Tokyo",
      "神奈川県": "Kanagawa",
      "新潟県": "Niigata",
      "富山県": "Toyama",
      "石川県": "Ishikawa",
      "福井県": "Fukui",
      "山梨県": "Yamanashi",
      "長野県": "Nagano",
      "岐阜県": "Gifu",
      "静岡県": "Shizuoka",
      "愛知県": "Aichi",
      "三重県": "Mie",
      "滋賀県": "Shiga",
      "京都府": "Kyoto",
      "大阪府": "Osaka",
      "兵庫県": "Hyogo",
      "奈良県": "Nara",
      "和歌山県": "Wakayama",
      "鳥取県": "Tottori",
      "島根県": "Shimane",
      "岡山県": "Okayama",
      "広島県": "Hiroshima",
      "山口県": "Yamaguchi",
      "徳島県": "Tokushima",
      "香川県": "Kagawa",
      "愛媛県": "Ehime",
      "高知県": "Kochi",
      "福岡県": "Fukuoka",
      "佐賀県": "Saga",
      "長崎県": "Nagasaki",
      "熊本県": "Kumamoto",
      "大分県": "Oita",
      "宮崎県": "Miyazaki",
      "鹿児島県": "Kagoshima",
      "沖縄県": "Okinawa",

      // English passthrough (if geojson uses English)
      Hokkaido: "Hokkaido",
      Aomori: "Aomori",
      Iwate: "Iwate",
      Miyagi: "Miyagi",
      Akita: "Akita",
      Yamagata: "Yamagata",
      Fukushima: "Fukushima",
      Ibaraki: "Ibaraki",
      Tochigi: "Tochigi",
      Gunma: "Gunma",
      Saitama: "Saitama",
      Chiba: "Chiba",
      Tokyo: "Tokyo",
      Kanagawa: "Kanagawa",
      Niigata: "Niigata",
      Toyama: "Toyama",
      Ishikawa: "Ishikawa",
      Fukui: "Fukui",
      Yamanashi: "Yamanashi",
      Nagano: "Nagano",
      Gifu: "Gifu",
      Shizuoka: "Shizuoka",
      Aichi: "Aichi",
      Mie: "Mie",
      Shiga: "Shiga",
      Kyoto: "Kyoto",
      Osaka: "Osaka",
      Hyogo: "Hyogo",
      Nara: "Nara",
      Wakayama: "Wakayama",
      Tottori: "Tottori",
      Shimane: "Shimane",
      Okayama: "Okayama",
      Hiroshima: "Hiroshima",
      Yamaguchi: "Yamaguchi",
      Tokushima: "Tokushima",
      Kagawa: "Kagawa",
      Ehime: "Ehime",
      Kochi: "Kochi",
      Fukuoka: "Fukuoka",
      Saga: "Saga",
      Nagasaki: "Nagasaki",
      Kumamoto: "Kumamoto",
      Oita: "Oita",
      Miyazaki: "Miyazaki",
      Kagoshima: "Kagoshima",
      Okinawa: "Okinawa",
    }),
    []
  );

  const normalizePrefecture = (raw: string): string | null => {
    const s = (raw || "").trim();
    if (!s) return null;
    return PREF_NAME_TO_CODE[s] ?? null;
  };

  // ✅ responsive container sizing (unchanged logic)
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1200);
      const height = width * 0.625;
      setContainerSize({ width, height });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ fetch lessons for the selected prefecture code (no unhandled promise)
  useEffect(() => {
    if (!selectedPrefectureCode) {
      setPrefLessons([]);
      return;
    }

    let cancelled = false;

    void (async (): Promise<void> => {
      setLessonsLoading(true);
      try {
        const data = await json<{ lessons: Lesson[] }>(
          `/lessons?prefecture=${encodeURIComponent(selectedPrefectureCode)}`
        );
        if (!cancelled) setPrefLessons(Array.isArray(data?.lessons) ? data.lessons : []);
      } catch {
        if (!cancelled) setPrefLessons([]);
      } finally {
        if (!cancelled) setLessonsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedPrefectureCode]);

  // ✅ D3 map render (same logic, optimized to avoid stale size)
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

    void d3.json("/japan.geojson").then((data: any) => {
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

      const getRawName = (d: any): string =>
        d?.properties?.nam_ja || d?.properties?.nam || "Unknown Prefecture";

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
            .duration(1250)
            .call(
              zoom.transform as any,
              d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );

          const rawName = getRawName(d);
          const code = normalizePrefecture(rawName);

          setSelectedPrefecture(rawName);
          setSelectedPrefectureCode(code);
          setPopup(null);
        });

      // teardrop markers
      data.features.forEach((d: any) => {
        const [cx, cy] = projection(d3.geoCentroid(d)) || [0, 0];

        const foreignObject = g
          .append("foreignObject")
          .attr("x", cx - 10)
          .attr("y", cy - 18)
          .attr("width", 30)
          .attr("height", 30)
          .style("pointer-events", "auto")
          .style("cursor", "pointer")
          .on("click", (event) => {
            event.stopPropagation();

            const rawName = getRawName(d);
            const code = normalizePrefecture(rawName);

            setPopup({ x: cx, y: cy, name: rawName });
            setSelectedPrefecture(rawName);
            setSelectedPrefectureCode(code);
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
      .call(
        zoom.transform as any,
        d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale)
      );

    svg.on("click", () => {
      svg
        .transition()
        .duration(1250)
        .call(
          zoom.transform as any,
          d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale)
        );
      setSelectedPrefecture(null);
      setSelectedPrefectureCode(null);
      setPopup(null);
    });
  }, [containerSize]); // (logic unchanged)

  return (
    <Box position="relative" width="100vw" minHeight="100vh" bgcolor="white">
      {/* ✅ HAMBURGER MENU FIXED IN SAFE POSITION */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
        }}
      >
        <Bart />
      </Box>

      <Box component="main" flexGrow={1} display="flex" flexDirection="column" justifyContent="center" width="100vw">
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          sx={{
            width: "100vw",
            aspectRatio: "16/11",
            position: "relative",
            border: "2px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#dee2e4",
          }}
        >
          {/* ✅ MAP SVG */}
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`200 0 ${containerSize.width} ${containerSize.height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block" }}
          />

          {/* ✅ POPUP: now driven by prefecture->lessons */}
          {popup && (
            <Box
              sx={{
                position: "absolute",
                top: popup.y + 100,
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
                width: "300px",
                paddingTop: "20px",
                paddingBottom: "20px",
                textAlign: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: "18px", textAlign: "center" }}>
                {popup.name}
              </Typography>

              <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.8 }}>
                {selectedPrefectureCode ? `Prefecture: ${selectedPrefectureCode}` : "Prefecture not mapped yet"}
              </Typography>

              <Box sx={{ mt: 1 }}>
                {lessonsLoading ? (
                  <Typography variant="body2">Loading lessons...</Typography>
                ) : prefLessons.length === 0 ? (
                  <Typography variant="body2">No lessons assigned to this prefecture.</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {prefLessons.slice(0, 3).map((lesson) => (
                      <Button
                        key={lesson.slug}
                        component={Link}
                        to={`/lesson/${lesson.slug}`}
                        sx={{
                          height: "44px",
                          borderRadius: "30px",
                          backgroundColor: "#92a6ba",
                          border: "none",
                          fontWeight: 300,
                          textTransform: "none",
                          margin: "0 auto",
                          color: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          width: "100%",
                          "&:hover": { backgroundColor: "#7a92a8" },
                        }}
                      >
                        {lesson.title} ({lesson.version})
                      </Button>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* ✅ INFO PANELS (kept unchanged; still static) */}
          <Box
            sx={{
              padding: "20px",
              width: "18vw",
              borderRadius: "10px",
              marginRight: "5vw",
              bgcolor: "#d3d3d3",
              paddingLeft: "20px",
              boxShadow: 3,
              zIndex: 1,
              marginTop: "5vh",
              position: "absolute",
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
                <img src="assets/Play Button 2.png" alt="Play" style={{ height: "50px" }} />
              </IconButton>

              <Typography variant="body1" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                Grammar Lesson 1
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 100 }}>
                Goal: Learn how to use これ、それ、は
              </Typography>

              <IconButton aria-label="Open Grammar Lesson 1" onClick={() => alert("Open Grammar Lesson 1")}>
                <img src="assets/Play Button 2.png" alt="Play" style={{ height: "50px" }} />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "20px",
              width: "18vw",
              borderRadius: "10px",
              marginRight: "5vw",
              bgcolor: "#d3d3d3",
              paddingLeft: "20px",
              boxShadow: 3,
              zIndex: 1,
              position: "absolute",
              marginTop: "65vh",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 400, mb: 2 }}>
              Stories:
            </Typography>

            <Button
              sx={{
                width: "18vw",
                height: "60px",
                borderRadius: "10px",
                backgroundColor: "#92a6ba",
                border: "none",
                fontWeight: 100,
                fontSize: "18px",
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
              Momotaro
              <img src="assets/Arrow.png" alt="Momotaro" style={{ height: "30px" }} />
            </Button>
          </Box>

          {/* Prefecture name display */}
          <Box
            mt={4}
            minHeight="50px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              opacity: selectedPrefecture ? 1 : 0,
              transform: selectedPrefecture ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.5s ease",
              color: "orange",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {selectedPrefecture && <Typography variant="h5">{selectedPrefecture}</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
