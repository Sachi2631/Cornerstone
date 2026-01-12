// src/pages/Home.tsx
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const EASE = [0.16, 1, 0.3, 1] as const;

const Home = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletDown = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // TODO: Replace with your real auth state (e.g., context/store selector)
  const isAuthed = Boolean(localStorage.getItem("authToken"));

  const go = (loggedInPath: string, publicPath: string) => {
    navigate(isAuthed ? loggedInPath : publicPath);
  };

  const sectionBox = (bgcolor: string, content: React.ReactNode, mt = 6) => (
    <Box
      sx={{
        bgcolor,
        mt,
        borderRadius: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 6, sm: 7, md: 8 },
        mx: { xs: 1.5, sm: 3, md: 6 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ px: 0 }}>
        {content}
      </Container>
    </Box>
  );

  const featureCard = (title: string, desc: string) => (
    <MotionCard
      elevation={3}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: 0.18, ease: EASE } }}
      sx={{ height: "100%", borderRadius: 3 }}
    >
      <CardContent sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" mb={1.5}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.92 }}>
          {desc}
        </Typography>
      </CardContent>
    </MotionCard>
  );

  return (
    <Box
      sx={{
        textAlign: "center",
        bgcolor: "#dfe2e5",
        mx: { xs: 0, sm: 2, md: 6 },
        my: { xs: 2, sm: 4, md: 5 },
        borderRadius: { xs: 0, sm: 4 },
        overflow: "hidden",
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          // Replace flat grey slab with a proper gradient
          background: "linear-gradient(135deg, rgba(180,61,32,0.12) 0%, rgba(255,255,255,0.65) 40%, rgba(180,61,32,0.06) 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* subtle texture blobs */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.35,
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              width: { xs: 280, sm: 420 },
              height: { xs: 280, sm: 420 },
              borderRadius: "50%",
              filter: "blur(28px)",
              animation: "floaty 12s ease-in-out infinite",
            },
            "&::before": {
              top: { xs: -140, sm: -200 },
              left: { xs: -120, sm: -180 },
              background: "rgba(180,61,32,0.55)",
            },
            "&::after": {
              bottom: { xs: -160, sm: -220 },
              right: { xs: -140, sm: -200 },
              background: "rgba(0,0,0,0.06)",
              animationDelay: "1.3s",
            },
            "@keyframes floaty": {
              "0%": { transform: "translate(0px, 0px) scale(1)" },
              "50%": { transform: "translate(18px, 14px) scale(1.07)" },
              "100%": { transform: "translate(0px, 0px) scale(1)" },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* main hero content */}
          <Box
            sx={{
              pt: { xs: 6, sm: 8 },
              pb: { xs: 10, sm: 12 }, // leave room for the floating card overlap
              textAlign: "center",
              maxWidth: 760,
              mx: "auto",
            }}
          >
            <Typography
              variant={isMobile ? "h3" : isTabletDown ? "h2" : "h1"}
              fontWeight={900}
              sx={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
              gutterBottom
            >
              Nihon-go!
            </Typography>

            <Typography
              variant={isMobile ? "body1" : "h6"}
              sx={{ opacity: 0.85, maxWidth: 560, mx: "auto" }}
              mb={3}
            >
              Learn Japanese in a fun, effective, and cultural way
            </Typography>

            {/* CTAs */}
            <Stack
              direction="column"
              spacing={1.5}
              sx={{
                mx: "auto",
                width: { xs: "100%", sm: 420 },
              }}
            >
              <Button
                variant="contained"
                onClick={() => go("/dashboard", "/auth")}
                sx={{
                  bgcolor: "#b43d20",
                  borderRadius: 2.5,
                  minHeight: 52,
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: "#9f341b" },
                }}
              >
                Start Now!
              </Button>

              <Button
                variant="outlined"
                onClick={() => go("/lesson", "/auth")}
                sx={{
                  color: "#b43d20",
                  borderColor: "rgba(180,61,32,0.65)",
                  borderWidth: 2,
                  borderRadius: 2.5,
                  minHeight: 52,
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "#9f341b",
                    bgcolor: "rgba(180, 61, 32, 0.06)",
                  },
                }}
              >
                Learn more
              </Button>
            </Stack>

            {/* chips (smaller + cleaner) */}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 1,
                px: 1,
              }}
            >
              {["Everyday Phrases", "Emergencies", "Work Culture", "Travel Japan", "Polite Speech"].map((label) => (
                <Chip
                  key={label}
                  label={label}
                  variant="outlined"
                  sx={{
                    fontWeight: 800,
                    borderColor: "rgba(180,61,32,0.45)",
                    color: "#b43d20",
                    bgcolor: "rgba(255,255,255,0.50)",
                    backdropFilter: "blur(6px)",
                    height: 32,
                    "& .MuiChip-label": { px: 1.25 },
                  }}
                />
              ))}
            </Box>

            {/* scroll hint (less dominant) */}
            <Box
              sx={{
                mt: 2.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                opacity: 0.7,
              }}
            >
              <Typography variant="body2">Scroll for more</Typography>
              <Box
                aria-hidden
                sx={{
                  width: 18,
                  height: 28,
                  border: "2px solid rgba(0,0,0,0.25)",
                  borderRadius: 999,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 6,
                    borderRadius: 2,
                    bgcolor: "rgba(0,0,0,0.35)",
                    position: "absolute",
                    left: "50%",
                    top: 6,
                    transform: "translateX(-50%)",
                    animation: "scrollDot 1.4s ease-in-out infinite",
                    "@keyframes scrollDot": {
                      "0%": { transform: "translate(-50%, 0)" },
                      "50%": { transform: "translate(-50%, 6px)" },
                      "100%": { transform: "translate(-50%, 0)" },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>

        {/* floating sample card (overlaps hero bottom instead of stacking inside) */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: { xs: -52, sm: -60 },
              px: { xs: 2, sm: 3 },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              elevation={8}
              sx={{
                width: "100%",
                maxWidth: 560,
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <CardContent sx={{ textAlign: "left" }}>
                <Typography variant="subtitle2" fontWeight={900} sx={{ opacity: 0.75 }}>
                  Try a quick sample
                </Typography>
                <Typography variant="h6" fontWeight={900} sx={{ mt: 0.5 }}>
                  Greetings 👋
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  “はじめまして” — Nice to meet you
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderRadius: 2.5,
                    minHeight: 46,
                    borderWidth: 2,
                    borderColor: "#b43d20",
                    color: "#b43d20",
                    fontWeight: 900,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#9f341b",
                      bgcolor: "rgba(180, 61, 32, 0.06)",
                    },
                  }}
                  onClick={() => go("/lesson", "/auth")}
                >
                  Open Sample Lesson
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* give space below hero because card overlaps */}
      <Box sx={{ height: { xs: 70, sm: 84 } }} />

      {/* ABOUT */}
      {sectionBox(
        "#91a7b9",
        <>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom textAlign="center">
            About Us
          </Typography>
          <Container maxWidth="md" sx={{ px: 0 }}>
            <Typography paragraph align="center" sx={{ mb: 2 }}>
              Many language learning programs exist – but many aren’t fun, interesting, or teach useful real-world phrases.
              Our goal is to build a website that helps you learn practical Japanese for everyday life, emergencies, and work.
            </Typography>
            <Typography paragraph align="center" sx={{ mb: 0 }}>
              We are Sara and Sachi, juniors at KLS, and we built this platform for curious, passionate learners who want
              to enjoy Japanese language and culture. Here, you’ll find music, games, history, events, and more to help you thrive in Japan.
            </Typography>
          </Container>
        </>,
        10
      )}

      {/* FEATURES */}
      {sectionBox(
        "#d3d3d3",
        <>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom textAlign="center">
            Features
          </Typography>
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                {featureCard(
                  "Learn Useful Japanese",
                  "Learn practical Japanese for your daily life. After completing the basics, you can choose between multiple routes, including learning financial or emergency medical terminology, work culture, navigating places, and more!"
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {featureCard(
                  "Gamified Learning",
                  "Our app is gamefied to increase motivation. Collect points and objects, pick a character (mythical creatures or unique Japanese animals), and travel around Japan as you level up!"
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {featureCard(
                  "All-Encompassing",
                  "Integrate your language acquisition with lessons on Japanese history, geography, society, folklore, and culture!"
                )}
              </Grid>
            </Grid>
          </Container>
        </>
      )}

      {/* TESTIMONIALS */}
      {sectionBox(
        "#91a7b9",
        <>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom textAlign="center">
            Testimonials
          </Typography>
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
              {[1, 2, 3].map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p}>
                  <MotionCard
                    elevation={3}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    whileHover={{ y: -4, transition: { duration: 0.18, ease: EASE } }}
                    sx={{ height: "100%", borderRadius: 3 }}
                  >
                    <CardContent sx={{ px: 2, py: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Person {p}
                      </Typography>
                      <Typography variant="body2">
                        “This app made learning Japanese so fun and practical. I love the cultural bits too!”
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      {/* CONTACT */}
      {sectionBox(
        "#d3d3d3",
        <Box textAlign="center">
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>

          <Container maxWidth="sm" sx={{ px: 0 }}>
            <Typography mb={2}>Don't hesitate to reach out if you have feedback, questions, or new ideas!</Typography>
            <Typography fontWeight="medium" color="primary">
              Sachi and Sara (Juniors)
            </Typography>

            <Box mt={5}>
              <Typography variant="h6" gutterBottom>
                Support our website!
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  minHeight: 48,
                  transition: "transform 160ms ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                Donate
              </Button>
            </Box>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Home;
