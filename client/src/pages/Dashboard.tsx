/// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import * as d3 from "d3";
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
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // FIX 1: geoData as STATE (not a ref) so the drawing effect re-runs when data loads.
  // A plain ref assignment (geoDataRef.current = data) never triggers re-renders,
  // meaning the drawing effect ran once with null data and never fired again.
  const [geoData, setGeoData] = useState<any>(null);

  // FIX 3: zoom stored in a ref so click handlers can call zoomRef.current.transform
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);

  const [prefLessons, setPrefLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const [upNext, setUpNext] = useState<UpNextLesson | null>(null);
  const [upNextLoading, setUpNextLoading] = useState(false);

  const PREF_NAME_TO_CODE = useMemo<Record<string, string>>(
    () => ({
      "北海道": "Hokkaido", "青森県": "Aomori", "岩手県": "Iwate",
      "宮城県": "Miyagi", "秋田県": "Akita", "山形県": "Yamagata",
      "福島県": "Fukushima", "茨城県": "Ibaraki", "栃木県": "Tochigi",
      "群馬県": "Gunma", "埼玉県": "Saitama", "千葉県": "Chiba",
      "東京都": "Tokyo", "神奈川県": "Kanagawa", "新潟県": "Niigata",
      "富山県": "Toyama", "石川県": "Ishikawa", "福井県": "Fukui",
      "山梨県": "Yamanashi", "長野県": "Nagano", "岐阜県": "Gifu",
      "静岡県": "Shizuoka", "愛知県": "Aichi", "三重県": "Mie",
      "滋賀県": "Shiga", "京都府": "Kyoto", "大阪府": "Osaka",
      "兵庫県": "Hyogo", "奈良県": "Nara", "和歌山県": "Wakayama",
      "鳥取県": "Tottori", "島根県": "Shimane", "岡山県": "Okayama",
      "広島県": "Hiroshima", "山口県": "Yamaguchi", "徳島県": "Tokushima",
      "香川県": "Kagawa", "愛媛県": "Ehime", "高知県": "Kochi",
      "福岡県": "Fukuoka", "佐賀県": "Saga", "長崎県": "Nagasaki",
      "熊本県": "Kumamoto", "大分県": "Oita", "宮崎県": "Miyazaki",
      "鹿児島県": "Kagoshima", "沖縄県": "Okinawa",
      // English passthrough so stored English codes also resolve
      Hokkaido: "Hokkaido", Aomori: "Aomori", Iwate: "Iwate",
      Miyagi: "Miyagi", Akita: "Akita", Yamagata: "Yamagata",
      Fukushima: "Fukushima", Ibaraki: "Ibaraki", Tochigi: "Tochigi",
      Gunma: "Gunma", Saitama: "Saitama", Chiba: "Chiba",
      Tokyo: "Tokyo", Kanagawa: "Kanagawa", Niigata: "Niigata",
      Toyama: "Toyama", Ishikawa: "Ishikawa", Fukui: "Fukui",
      Yamanashi: "Yamanashi", Nagano: "Nagano", Gifu: "Gifu",
      Shizuoka: "Shizuoka", Aichi: "Aichi", Mie: "Mie",
      Shiga: "Shiga", Kyoto: "Kyoto", Osaka: "Osaka",
      Hyogo: "Hyogo", Nara: "Nara", Wakayama: "Wakayama",
      Tottori: "Tottori", Shimane: "Shimane", Okayama: "Okayama",
      Hiroshima: "Hiroshima", Yamaguchi: "Yamaguchi", Tokushima: "Tokushima",
      Kagawa: "Kagawa", Ehime: "Ehime", Kochi: "Kochi",
      Fukuoka: "Fukuoka", Saga: "Saga", Nagasaki: "Nagasaki",
      Kumamoto: "Kumamoto", Oita: "Oita", Miyazaki: "Miyazaki",
      Kagoshima: "Kagoshima", Okinawa: "Okinawa",
    }),
    []
  );

  const normalizePrefecture = useCallback(
    (raw: string): string | null => {
      const s = (raw || "").trim();
      if (!s) return null;
      return PREF_NAME_TO_CODE[s] ?? null;
    },
    [PREF_NAME_TO_CODE]
  );

  // Responsive container size
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth * 0.9, 1200);
      setContainerSize({ width, height: width * 0.625 });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load up-next lesson
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        setUpNextLoading(true);
        const data = await getUpNextLesson();
        if (!cancelled) setUpNext(data);
      } catch (e) {
        console.error("[Dashboard] up-next failed:", e);
        if (!cancelled) setUpNext(null);
      } finally {
        if (!cancelled) setUpNextLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load lessons for clicked prefecture
  useEffect(() => {
    if (!selectedPrefectureCode) { setPrefLessons([]); return; }
    let cancelled = false;
    void (async (): Promise<void> => {
      setLessonsLoading(true);
      try {
        const data = await json<{ lessons: Lesson[] }>(
          `/api/lessons?prefecture=${encodeURIComponent(selectedPrefectureCode)}`
        );
        if (!cancelled) setPrefLessons(Array.isArray(data?.lessons) ? data.lessons : []);
      } catch {
        if (!cancelled) setPrefLessons([]);
      } finally {
        if (!cancelled) setLessonsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedPrefectureCode]);

  // ─── Effect 1: one-time SVG + zoom setup, then load GeoJSON ───────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");
    gRef.current = g;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));

    // FIX 3: store zoom in ref — click handlers need it for zoom.transform
    zoomRef.current = zoom;
    svg.call(zoom as any);

    d3.json("/japan.geojson")
      .then((data: any) => {
        if (data?.features) {
          // FIX 1: setState triggers the drawing effect below
          setGeoData(data);
        }
      })
      .catch((e) => console.error("[Dashboard] GeoJSON load failed:", e));

    return () => { g.remove(); };
  }, []);

  // ─── Effect 2: draw/update map whenever geoData or size changes ────────────
  // FIX 1: this effect now has `geoData` in deps — it fires when data arrives
  useEffect(() => {
    if (!svgRef.current || !gRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);
    const g = gRef.current;
    const { width, height } = containerSize;

    const projection = d3.geoMercator().fitExtent(
      [[60, 40], [width - 20, height - 20]],
      geoData
    );
    const path = d3.geoPath().projection(projection);

    const getRawName = (d: any): string =>
      d?.properties?.nam_ja || d?.properties?.nam || "Unknown Prefecture";

    // Prefecture fill paths
    g.selectAll<SVGPathElement, any>("path.pref-path")
      .data(geoData.features)
      .join((enter) =>
        enter.append("path").attr("class", "pref-path")
      )
      .attr("d", path as any)
      .attr("fill", "#b4441d")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#90caf9");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#b4441d");
      })
      .on("click", function (event: MouseEvent, d: any) {
        event.stopPropagation();

        const [[x0, y0], [x1, y1]] = path.bounds(d);
        const x = (x0 + x1) / 2;
        const y = (y0 + y1) / 2;
        const scale = Math.max(
          1,
          Math.min(6, 0.6 / Math.max((x1 - x0) / width, (y1 - y0) / height))
        );

        // FIX 3: correct zoom transition — was calling zoomIdentity directly on
        // the selection which doesn't work. Must pass zoom behavior + transform.
        if (zoomRef.current) {
          svg.transition().duration(1250).call(
            zoomRef.current.transform as any,
            d3.zoomIdentity
              .translate(width / 2 - scale * x, height / 2 - scale * y)
              .scale(scale)
          );
        }

        const rawName = getRawName(d);
        setSelectedPrefectureCode(normalizePrefecture(rawName));
        setPopup(null);
      });

    // FIX 4: replace createRoot-in-loop (memory leak) with D3-native circle markers.
    // createRoot created a new React root per prefecture per resize — hundreds of
    // orphaned React trees. Simple SVG circles are the right tool here.
    g.selectAll("circle.pref-marker").remove();

    geoData.features.forEach((d: any) => {
      const centroid = projection(d3.geoCentroid(d));
      if (!centroid) return;
      const [cx, cy] = centroid;

      g.append("circle")
        .attr("class", "pref-marker")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 4)
        .attr("fill", "#1a1a1a")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.2)
        .style("cursor", "pointer")
        .style("pointer-events", "all")
        .on("mouseover", function () {
          d3.select(this).attr("r", 6).attr("fill", "#b4441d");
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 4).attr("fill", "#1a1a1a");
        })
        .on("click", (event: MouseEvent) => {
          event.stopPropagation();
          const rawName = getRawName(d);
          // FIX: event.clientX/Y is always accurate regardless of zoom level.
          // The old approach (svgRect.left + cx) was wrong after the user panned/zoomed.
          setPopup({ x: event.clientX, y: event.clientY, name: rawName });
          setSelectedPrefectureCode(normalizePrefecture(rawName));
        });
    });
  }, [geoData, containerSize, normalizePrefecture]);

  return (
    <Box position="relative" width="100vw" minHeight="100vh" bgcolor="white">
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <Box component="main" width="100vw">
        <Box
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
          {/* FIX 2: viewBox was "200 0 W H" — the 200 x-offset pushed most of Japan
              off-screen to the left. Changed to "0 0 W H". */}
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ display: "block" }}
          />

          {/* Prefecture popup */}
          {popup && (
            <Box
              sx={{
                position: "fixed",
                top: popup.y - 90,
                left: popup.x + 14,
                backgroundColor: "#d7ccc8",
                borderRadius: "16px",
                p: 2,
                minWidth: 220,
                maxWidth: 280,
                boxShadow: 6,
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {popup.name}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ height: 30, width: 30, ml: 1 }}
                  onClick={() => setPopup(null)}
                >
                  ✖
                </IconButton>
              </Box>

              {lessonsLoading ? (
                <Typography variant="body2">Loading lessons…</Typography>
              ) : prefLessons.length > 0 ? (
                prefLessons.map((lesson) => (
                  <Typography key={lesson.slug} variant="body2" sx={{ mb: 0.5 }}>
                    • {lesson.title} ({lesson.version})
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">No lessons found.</Typography>
              )}
            </Box>
          )}

          {/* Up Next panel — FIX: was "18vw" hard-coded, unusable on mobile */}
          <Box
            sx={{
              position: "absolute",
              top: "5vh",
              right: "5vw",
              p: "20px",
              width: { xs: "60vw", sm: "180px", md: "18vw" },
              maxWidth: 240,
              borderRadius: "10px",
              bgcolor: "#d3d3d3",
              boxShadow: 3,
              zIndex: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Up next:
            </Typography>

            <Box sx={{ textAlign: "center" }}>
              {upNextLoading ? (
                <Typography variant="body2">Loading…</Typography>
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
                    <img
                      src="assets/Play Button 2.png"
                      alt="Play"
                      style={{ height: "50px" }}
                    />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Stories panel — FIX: was "22vw" hard-coded */}
          <Box
            sx={{
              position: "absolute",
              left: "7vw",
              bottom: "8vh",
              backgroundColor: "#8c9cab",
              borderRadius: "20px",
              p: 3,
              width: { xs: "60vw", sm: "200px", md: "22vw" },
              maxWidth: 300,
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