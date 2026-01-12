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
          bgcolor: "cerulean", // keep your original intent
          minHeight: { xs: "82vh", sm: "68vh" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 6 },
          pt: { xs: 5, sm: 0 },
          overflow: "hidden",
        }}
      >
        {/* Background layer (fills “blank” space visually) */}
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
              width: { xs: 360, sm: 520 },
              height: { xs: 360, sm: 520 },
              borderRadius: "50%",
              filter: "blur(30px)",
              transform: "translate3d(0,0,0)",
              animation: "floaty 12s ease-in-out infinite",
            },
            "&::before": {
              top: { xs: -160, sm: -220 },
              left: { xs: -140, sm: -200 },
              background: "rgba(180, 61, 32, 0.55)",
            },
            "&::after": {
              bottom: { xs: -170, sm: -240 },
              right: { xs: -160, sm: -220 },
              background: "rgba(255,255,255,0.65)",
              animationDelay: "1.6s",
            },
            "@keyframes floaty": {
              "0%": { transform: "translate(0px, 0px) scale(1)" },
              "50%": { transform: "translate(24px, 18px) scale(1.06)" },
              "100%": { transform: "translate(0px, 0px) scale(1)" },
            },
          }}
        />

        <Container maxWidth="lg" sx={{ px: 0, position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
              gap: { xs: 3, md: 4 },
              alignItems: "center",
              pt: { xs: 2, sm: "16vh" },
            }}
          >
            {/* Left: headline + CTAs + hero fillers */}
            <Box>
              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <Typography
                  variant={isMobile ? "h3" : isTabletDown ? "h2" : "h1"}
                  fontWeight="bold"
                  gutterBottom
                  sx={{ lineHeight: 1.05, wordBreak: "break-word" }}
                >
                  Nihon-go!
                </Typography>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
              >
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  mb={2.5}
                  sx={{ opacity: 0.95 }}
                >
                  Learn Japanese in a fun, effective, and cultural way
                </Typography>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  alignItems="center"
                  sx={{ mb: 2.5 }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#b43d20",
                      color: "#dfe2e5",
                      minHeight: 52,
                      width: { xs: "min(460px, 92vw)", sm: 220, md: 260 },
                      borderRadius: "10px",
                      px: 3,
                      boxShadow: 3,
                      transition: "transform 180ms ease, box-shadow 180ms ease",
                      "&:hover": {
                        backgroundColor: "#9f341b",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => go("/dashboard", "/auth")}
                  >
                    Start Now!
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      color: "#b43d20",
                      borderColor: "#b43d20",
                      borderWidth: 3,
                      minHeight: 52,
                      width: { xs: "min(460px, 92vw)", sm: 220, md: 260 },
                      borderRadius: "10px",
                      px: 3,
                      transition: "transform 180ms ease, background-color 180ms ease",
                      "&:hover": {
                        borderColor: "#9f341b",
                        borderWidth: 3,
                        backgroundColor: "rgba(180, 61, 32, 0.06)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => go("/lesson", "/auth")}
                  >
                    Learn more
                  </Button>
                </Stack>
              </MotionBox>

              {/* “Filler” that makes hero feel complete (no blank area) */}
              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent={{ xs: "center", md: "flex-start" }}
                  flexWrap="wrap"
                  sx={{ rowGap: 1 }}
                >
                  {[
                    "Everyday Phrases",
                    "Emergencies",
                    "Work Culture",
                    "Travel Japan",
                    "Polite Speech",
                  ].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      variant="outlined"
                      sx={{
                        borderColor: "rgba(180,61,32,0.55)",
                        color: "#b43d20",
                        bgcolor: "rgba(255,255,255,0.35)",
                        backdropFilter: "blur(6px)",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              </MotionBox>

              {/* Scroll hint */}
              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
                sx={{
                  mt: { xs: 2.5, md: 3 },
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  alignItems: "center",
                  gap: 1,
                  opacity: 0.9,
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Scroll for features & testimonials
                </Typography>
                <MotionBox
                  aria-hidden
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  sx={{
                    width: 20,
                    height: 32,
                    border: "2px solid rgba(0,0,0,0.35)",
                    borderRadius: 20,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 4,
                      height: 6,
                      borderRadius: 2,
                      bgcolor: "rgba(0,0,0,0.45)",
                      position: "absolute",
                      left: "50%",
                      top: 6,
                      transform: "translateX(-50%)",
                    }}
                  />
                </MotionBox>
              </MotionBox>
            </Box>

            {/* Right: lesson preview fills empty hero space on desktop */}
            <MotionBox
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Card
                elevation={6}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "rgba(255,255,255,0.72)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 2.5, textAlign: "left" }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ opacity: 0.8 }}>
                      Today’s Lesson
                    </Typography>
                    <Typography variant="h6" fontWeight={900} sx={{ mt: 0.5 }}>
                      Ordering Food 🍜
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                      Learn phrases you’ll actually say in Japan.
                    </Typography>
                  </Box>

                  <Divider />

                  <Box sx={{ p: 2.5, textAlign: "left" }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ opacity: 0.8, mb: 1 }}>
                      Practice
                    </Typography>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "rgba(180,61,32,0.08)",
                        border: "1px solid rgba(180,61,32,0.18)",
                      }}
                    >
                      <Typography fontWeight={800} sx={{ mb: 0.5 }}>
                        すみません
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        “Excuse me” (polite attention getter)
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", rowGap: 1 }}>
                      <Chip label="Listening" size="small" sx={{ fontWeight: 700 }} />
                      <Chip label="Speaking" size="small" sx={{ fontWeight: 700 }} />
                      <Chip label="Culture" size="small" sx={{ fontWeight: 700 }} />
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        mt: 2.5,
                        backgroundColor: "#b43d20",
                        borderRadius: 2,
                        minHeight: 44,
                        "&:hover": { backgroundColor: "#9f341b" },
                      }}
                      onClick={() => go("/lesson", "/auth")}
                    >
                      Continue Lesson
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </MotionBox>

            {/* On mobile/tablet: show a compact preview under CTAs (fills blank space) */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <MotionBox
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
              >
                <Card
                  elevation={4}
                  sx={{
                    mt: 3,
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CardContent sx={{ textAlign: "left" }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ opacity: 0.8 }}>
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
                        borderRadius: 2,
                        minHeight: 44,
                        borderWidth: 2,
                        borderColor: "#b43d20",
                        color: "#b43d20",
                        "&:hover": {
                          borderWidth: 2,
                          borderColor: "#9f341b",
                          backgroundColor: "rgba(180, 61, 32, 0.06)",
                        },
                      }}
                      onClick={() => go("/lesson", "/auth")}
                    >
                      Open Sample Lesson
                    </Button>
                  </CardContent>
                </Card>
              </MotionBox>
            </Box>
          </Box>
        </Container>

        {/* Bottom callout (cat + Shinjuku) */}
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                textAlign: "left",
                transform: { xs: "none", sm: "translateY(18px)" },
                pb: { xs: 2, sm: 0 },
              }}
            >
              <Box
                component="img"
                src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png"
                alt="Cat"
                sx={{ width: { xs: 64, sm: 88, md: 100 }, height: "auto", flexShrink: 0 }}
              />
              <Box sx={{ pt: { xs: 0.5, sm: 1 } }}>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} gutterBottom sx={{ lineHeight: 1.15 }}>
                  Shinjuku
                </Typography>
                <Typography variant={isMobile ? "body2" : "h6"}>
                  This is Shinjuku! It's the capital of Tokyo Prefecture.
                </Typography>
              </Box>
            </MotionBox>
          </Container>
        </Box>
      </Box>

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
