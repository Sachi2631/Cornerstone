/// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [geoData, setGeoData] = useState<any>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [selectedPrefectureCode, setSelectedPrefectureCode] = useState<string | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  // containerSize is driven by the actual container element, not the window
  const [containerSize, setContainerSize] = useState({ width: 900, height: 600 });
  const [popup, setPopup] = useState<{ x: number; y: number; name: string } | null>(null);

  const [prefLessons, setPrefLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const [upNext, setUpNext] = useState<UpNextLesson | null>(null);
  const [upNextLoading, setUpNextLoading] = useState(false);

  // ── Prefecture name → English code map ──────────────────────────────────────
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
      // English passthrough
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

  // ── Zoom-out helper (resets to identity) ────────────────────────────────────
  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomRef.current.transform as any, d3.zoomIdentity);
    setIsZoomedIn(false);
    setSelectedPrefectureCode(null);
    setPopup(null);
  }, []);

  // ── Responsive: measure the actual container element ───────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setContainerSize({ width, height });
    });
    ro.observe(el);
    // seed immediately
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) setContainerSize({ width, height });
    return () => ro.disconnect();
  }, []);

  // ── Load up-next lesson ──────────────────────────────────────────────────────
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

  // ── Load lessons for clicked prefecture ─────────────────────────────────────
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

  // ── Effect 1: one-time SVG + zoom setup, load GeoJSON ───────────────────────
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");
    gRef.current = g;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => g.attr("transform", event.transform));

    zoomRef.current = zoom;
    svg.call(zoom as any);

    d3.json("/japan.geojson")
      .then((data: any) => {
        if (data?.features) setGeoData(data);
      })
      .catch((e) => console.error("[Dashboard] GeoJSON load failed:", e));

    return () => { g.remove(); };
  }, []);

  // ── Effect 2: draw/update map whenever geoData, size, or resetZoom changes ──
  useEffect(() => {
    if (!svgRef.current || !gRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);
    const g = gRef.current;
    const { width, height } = containerSize;

    const projection = d3.geoMercator().fitExtent(
      [[60, 30], [width - 20, height - 20]],
      geoData
    );
    const path = d3.geoPath().projection(projection);

    const getRawName = (d: any): string =>
      d?.properties?.nam_ja || d?.properties?.nam || "Unknown Prefecture";

    // ── Sea background rect: click → zoom out ──────────────────────────────
    // Must be the FIRST child so it sits behind all prefectures.
    g.selectAll("rect.sea-bg").remove();
    g.insert("rect", ":first-child")
      .attr("class", "sea-bg")
      .attr("x", -9999)
      .attr("y", -9999)
      .attr("width", 99999)
      .attr("height", 99999)
      .attr("fill", "transparent")
      .style("cursor", "default")
      .on("click", () => {
        resetZoom();
      });

    // ── Prefecture fill paths ───────────────────────────────────────────────
    g.selectAll<SVGPathElement, any>("path.pref-path")
      .data(geoData.features)
      .join((enter) => enter.append("path").attr("class", "pref-path"))
      .attr("d", path as any)
      .attr("fill", "#b4441d")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.6)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#e8a87c").attr("stroke-width", 1.2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#b4441d").attr("stroke-width", 0.6);
      })
      .on("click", function (event: MouseEvent, d: any) {
        event.stopPropagation(); // prevent bubble to sea-bg

        const bounds = path.bounds(d);
        const [[x0, y0], [x1, y1]] = bounds;
        const cx = (x0 + x1) / 2;
        const cy = (y0 + y1) / 2;

        // Scale so the prefecture fills ~60% of the viewport
        const prefW = x1 - x0;
        const prefH = y1 - y0;
        const scale = Math.max(
          1.5,
          Math.min(8, Math.min((width * 0.6) / prefW, (height * 0.6) / prefH))
        );

        if (zoomRef.current) {
          svg.transition().duration(900).ease(d3.easeCubicInOut).call(
            zoomRef.current.transform as any,
            d3.zoomIdentity
              .translate(width / 2 - scale * cx, height / 2 - scale * cy)
              .scale(scale)
          );
        }

        setIsZoomedIn(true);
        const rawName = getRawName(d);
        setSelectedPrefectureCode(normalizePrefecture(rawName));
        setPopup({ x: event.clientX, y: event.clientY, name: rawName });
      });

    // ── Prefecture dot markers ──────────────────────────────────────────────
    // Remove stale markers first, then redraw for current projection
    g.selectAll("circle.pref-marker").remove();

    geoData.features.forEach((d: any) => {
      const centroid = projection(d3.geoCentroid(d));
      if (!centroid) return;
      const [markerX, markerY] = centroid;

      g.append("circle")
        .attr("class", "pref-marker")
        .attr("cx", markerX)
        .attr("cy", markerY)
        .attr("r", 3.5)
        .attr("fill", "rgba(255,255,255,0.85)")
        .attr("stroke", "#b4441d")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .style("pointer-events", "all")
        .on("mouseover", function () {
          d3.select(this).attr("r", 6).attr("fill", "#fff").attr("stroke", "#7a2b10");
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 3.5).attr("fill", "rgba(255,255,255,0.85)").attr("stroke", "#b4441d");
        })
        .on("click", (event: MouseEvent) => {
          event.stopPropagation(); // prevent bubble to sea-bg
          const rawName = getRawName(d);
          setPopup({ x: event.clientX, y: event.clientY, name: rawName });
          setSelectedPrefectureCode(normalizePrefecture(rawName));
        });
    });
  }, [geoData, containerSize, normalizePrefecture, resetZoom]);

  return (
    // Root fills the full viewport — overflow hidden prevents any scroll
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "#dee2e4",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Nav bar ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 20,
        }}
      >
        <Bart />
      </Box>

      {/* ── Map fills remaining height ───────────────────────────────────────── */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* The SVG map */}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* ── Zoom-out hint badge (visible only when zoomed in) ──────────────── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(0,0,0,0.55)",
            color: "#fff",
            borderRadius: 999,
            px: 2,
            py: 0.75,
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            pointerEvents: "none",
            backdropFilter: "blur(6px)",
            transition: "opacity 0.3s",
            opacity: isZoomedIn ? 1 : 0,
            whiteSpace: "nowrap",
          }}
        >
          Click the sea to zoom out
        </Box>

        {/* ── Prefecture popup ──────────────────────────────────────────────── */}
        {popup && (
          <Box
            sx={{
              position: "fixed",
              top: popup.y - 100,
              left: popup.x + 16,
              bgcolor: "rgba(255,252,248,0.97)",
              borderRadius: "16px",
              p: 2,
              minWidth: 220,
              maxWidth: 280,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              border: "1px solid rgba(0,0,0,0.08)",
              zIndex: 1000,
              backdropFilter: "blur(8px)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
              <Typography variant="h6" fontWeight={800} noWrap sx={{ fontSize: "1rem" }}>
                {popup.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => { setPopup(null); }}
                sx={{ ml: 1, color: "text.secondary", "&:hover": { color: "text.primary" } }}
              >
                ✕
              </IconButton>
            </Box>

            {lessonsLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={14} sx={{ color: "#b4441d" }} />
                <Typography variant="body2" color="text.secondary">Loading lessons…</Typography>
              </Box>
            ) : prefLessons.length > 0 ? (
              prefLessons.map((lesson) => (
                <Box
                  key={lesson.slug}
                  component={Link}
                  to={`/lesson/${lesson.slug}`}
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    py: 0.5,
                    px: 1,
                    borderRadius: "8px",
                    mb: 0.5,
                    "&:hover": { bgcolor: "rgba(180,68,29,0.07)" },
                    transition: "background 0.15s",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    {lesson.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lesson.version}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No lessons available yet.
              </Typography>
            )}
          </Box>
        )}

        {/* ── Up Next panel ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            p: 2.5,
            width: { xs: "56vw", sm: 200, md: 220 },
            maxWidth: 240,
            borderRadius: "14px",
            bgcolor: "rgba(255,252,248,0.92)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.07)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          <Typography
            sx={{ fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#b4441d", mb: 1.5 }}
          >
            Up Next
          </Typography>

          {upNextLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={14} sx={{ color: "#b4441d" }} />
              <Typography variant="body2" color="text.secondary">Loading…</Typography>
            </Box>
          ) : !upNext ? (
            <Typography variant="body2" color="text.secondary">
              No saved lesson yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.3 }}>
                {upNext.title}{upNext.version ? ` (${upNext.version})` : ""}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {upNext.prefecture || "—"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Step {upNext.lastStep + 1}
              </Typography>

              <IconButton
                aria-label={`Resume ${upNext.title}`}
                component={Link}
                to={`/lesson/${upNext.slug}`}
                sx={{
                  alignSelf: "center",
                  mt: 1,
                  width: 48,
                  height: 48,
                  bgcolor: "#b4441d",
                  color: "#fff",
                  "&:hover": { bgcolor: "#9d351c" },
                  boxShadow: "0 4px 14px rgba(180,68,29,0.35)",
                  transition: "all 0.2s",
                }}
              >
                ▶
              </IconButton>
            </Box>
          )}
        </Box>

        {/* ── Stories panel ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            left: 16,
            bottom: 16,
            bgcolor: "rgba(140,156,171,0.92)",
            borderRadius: "16px",
            p: { xs: 2, sm: 2.5 },
            width: { xs: "56vw", sm: 200, md: 240 },
            maxWidth: 280,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: "1rem", mb: 0.5 }}>
            Stories
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, lineHeight: 1.5 }}>
            Continue your journey through Japanese culture and stories.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;