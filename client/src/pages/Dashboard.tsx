// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import * as d3 from "d3";
import { createRoot } from "react-dom/client";
import Bart from "../components/Menut";
import { Link } from "react-router-dom";
import { json } from "../services/api";
import { getUpNextLesson, UpNextLesson } from "../services/progress";

type Lesson = {
  slug: string;
  title: string;
  version: string;
  flashcards: string[];
  prefecture: string;
  isActive?: boolean;
};

const Dashboard = (): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);

  const [prefLessons, setPrefLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsDebug, setLessonsDebug] = useState<any>(null);

  const [upNext, setUpNext] = useState<UpNextLesson | null>(null);
  const [upNextLoading, setUpNextLoading] = useState(false);

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

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        setUpNextLoading(true);
        const data = await getUpNextLesson();
        if (!cancelled) setUpNext(data);
      } catch (e) {
        console.error("[Dashboard] up-next fetch failed:", e);
        if (!cancelled) setUpNext(null);
      } finally {
        if (!cancelled) setUpNextLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPrefectureCode) {
      setPrefLessons([]);
      setLessonsDebug(null);
      return;
    }

    let cancelled = false;

    void (async (): Promise<void> => {
      setLessonsLoading(true);

      const url = `/api/lessons?prefecture=${encodeURIComponent(selectedPrefectureCode)}`;

      try {
        const data = await json<{ lessons: Lesson[] }>(url);
        const lessons: Lesson[] = Array.isArray(data?.lessons) ? data.lessons : [];

        if (!cancelled) {
          setPrefLessons(lessons);
          setLessonsDebug({
            url,
            selectedPrefecture,
            selectedPrefectureCode,
            count: lessons.length,
            sample: lessons.slice(0, 5),
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setPrefLessons([]);
          setLessonsDebug({
            url,
            selectedPrefecture,
            selectedPrefectureCode,
            error: {
              status: e?.response?.status,
              message: e?.message,
              data: e?.response?.data,
            },
          });
        }
      } finally {
        if (!cancelled) setLessonsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedPrefectureCode, selectedPrefecture]);

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
          const scale = Math.max(1, Math.min(6, 0.6 / Math.max(dx / width, dy / height)));
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

            const svgRect = svgRef.current?.getBoundingClientRect();

            if (svgRect) {
              const screenX = svgRect.left + cx;
              const screenY = svgRect.top + cy;

              setPopup({
                x: screenX,
                y: screenY,
                name: rawName,
              });
            }

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
  }, [containerSize, normalizePrefecture]);

  return (
    <Box position="relative" width="100vw" minHeight="100vh" bgcolor="white">
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100vw"
      >
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
                position: "fixed",
                top: popup.y - 80,
                left: popup.x + 20,
                backgroundColor: "#d7ccc8",
                borderRadius: "16px",
                padding: 2,
                minWidth: 220,
                boxShadow: 6,
                zIndex: 1000,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {popup.name}
              </Typography>

              {lessonsLoading ? (
                <Typography variant="body2">Loading lessons...</Typography>
              ) : prefLessons.length > 0 ? (
                prefLessons.map((lesson) => (
                  <Typography key={lesson.slug} variant="body2" sx={{ mb: 0.5 }}>
                    • {lesson.title} ({lesson.version})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No lessons found.</Typography>
              )}

              <Box mt={1}>
                <IconButton size="small" onClick={() => setPopup(null)}>
                  ✖
                </IconButton>
              </Box>
            </Box>
          )}

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
              {upNextLoading ? (
                <Typography variant="body2">Loading...</Typography>
              ) : !upNext ? (
                <Typography variant="body2">No saved lesson yet.</Typography>
              ) : (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {upNext.title}
                    {upNext.version ? ` (${upNext.version})` : ""}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 100 }}>
                    Prefecture: {upNext.prefecture || "—"}
                  </Typography>

                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 100 }}>
                    Resume from step {upNext.lastStep + 1}
                  </Typography>

                  <IconButton
                    aria-label={`Resume ${upNext.title}`}
                    component={Link}
                    to={`/lesson/${upNext.slug}`}
                  >
                    <img src="assets/Play Button 2.png" alt="Play" style={{ height: "50px" }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: "7vw",
              bottom: "8vh",
              backgroundColor: "#8c9cab",
              borderRadius: "20px",
              p: 3,
              width: "22vw",
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
              Stories
            </Typography>

            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Continue your journey through Japanese culture and stories.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;