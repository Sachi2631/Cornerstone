import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface RewardProps {
  title: string;
  xp: number | string;
  imageUrl?: string;
}

const CONFETTI_CHARS = ["🎊", "⭐", "✨", "🏅", "🎉", "💫"];

const Rewards: React.FC<RewardProps> = ({ title, xp, imageUrl }) => {
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; char: string; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Stagger-in
    const t = setTimeout(() => setVisible(true), 80);

    // Generate confetti bursts
    const pieces = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      char: CONFETTI_CHARS[i % CONFETTI_CHARS.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.2 + Math.random() * 0.8,
    }));
    setConfetti(pieces);

    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 2, sm: 3 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <Box
          key={c.id}
          sx={{
            position: "absolute",
            top: -20,
            left: `${c.x}%`,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
            animation: `fall ${c.duration}s ${c.delay}s ease-in forwards`,
            "@keyframes fall": {
              "0%": { transform: "translateY(0) rotate(0deg)", opacity: 1 },
              "100%": { transform: "translateY(340px) rotate(540deg)", opacity: 0 },
            },
            pointerEvents: "none",
          }}
        >
          {c.char}
        </Box>
      ))}

      {/* Trophy icon */}
      <Box
        sx={{
          width: { xs: 72, sm: 88 },
          height: { xs: 72, sm: 88 },
          borderRadius: "50%",
          bgcolor: "rgba(180,61,32,0.08)",
          border: "3px solid rgba(180,61,32,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s",
          transform: visible ? "scale(1)" : "scale(0.4)",
          opacity: visible ? 1 : 0,
          animation: visible ? "trophy-pulse 2.5s 0.5s ease-in-out infinite" : "none",
          "@keyframes trophy-pulse": {
            "0%, 100%": { boxShadow: "0 0 0 0 rgba(180,61,32,0.2)" },
            "50%": { boxShadow: "0 0 0 16px rgba(180,61,32,0)" },
          },
        }}
      >
        <EmojiEventsRoundedIcon sx={{ fontSize: { xs: "2.5rem", sm: "3rem" }, color: "#B43D20" }} />
      </Box>

      {/* Headline */}
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: "1.6rem", sm: "2rem" },
          letterSpacing: "-0.02em",
          color: "#1C1917",
          transition: "transform 0.5s 0.15s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s 0.15s",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          opacity: visible ? 1 : 0,
          lineHeight: 1.2,
        }}
      >
        Lesson Complete! 🎉
      </Typography>

      {/* Earned label */}
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mt: 0.75,
          mb: 2,
          fontWeight: 500,
          transition: "opacity 0.4s 0.25s",
          opacity: visible ? 1 : 0,
        }}
      >
        You earned:
      </Typography>

      {/* Title badge */}
      <Box
        sx={{
          display: "inline-block",
          transition: "transform 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s 0.3s",
          transform: visible ? "scale(1)" : "scale(0.8)",
          opacity: visible ? 1 : 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: "1.4rem", sm: "1.75rem" },
            color: "#B43D20",
            letterSpacing: "-0.02em",
            mb: 1.5,
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* XP chip */}
      <Box
        sx={{
          transition: "transform 0.5s 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s 0.4s",
          transform: visible ? "scale(1)" : "scale(0.7)",
          opacity: visible ? 1 : 0,
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Chip
          icon={<StarRoundedIcon sx={{ color: "#B43D20 !important" }} />}
          label={`+${xp} XP`}
          sx={{
            fontWeight: 900,
            fontSize: "1rem",
            px: 1.5,
            height: 38,
            bgcolor: "rgba(180,61,32,0.08)",
            color: "#B43D20",
            border: "1.5px solid rgba(180,61,32,0.22)",
          }}
        />
      </Box>

      {/* Item preview */}
      <Box
        sx={{
          transition: "transform 0.6s 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s 0.5s",
          transform: visible ? "translateY(0)" : "translateY(24px)",
          opacity: visible ? 1 : 0,
        }}
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={title}
            sx={{
              width: { xs: "85%", sm: "65%" },
              maxHeight: { xs: "30vh", sm: "38vh" },
              objectFit: "contain",
              borderRadius: "16px",
              mx: "auto",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: { xs: "26vh", sm: "34vh" },
              maxHeight: 260,
              width: { xs: "85%", sm: "65%" },
              mx: "auto",
              borderRadius: "16px",
              bgcolor: "#F3F4F6",
              border: "1px solid rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Typography sx={{ fontSize: "3rem" }}>🎁</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Item Preview
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Rewards;