import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

interface RewardProps {
  title: string;
  xp: number | string;
}

// FIX: props were completely ignored before — hardcoded "Aritaware" always showed
const Reward: React.FC<RewardProps> = ({ title, xp }) => {
  return (
    <Box sx={{ textAlign: "center", py: 3 }}>
      <Typography variant="h5" fontWeight={700}>
        Complete! 🎉
      </Typography>

      <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
        You earned:
      </Typography>

      <Typography
        variant="h4"
        fontWeight={900}
        sx={{ mt: 1, color: "#b4441d", letterSpacing: "-0.02em" }}
      >
        {title}
      </Typography>

      <Chip
        icon={<EmojiEventsIcon />}
        label={`+${xp} XP`}
        sx={{
          mt: 1.5,
          fontWeight: 900,
          fontSize: "1rem",
          px: 1,
          bgcolor: "rgba(180,68,29,0.10)",
          color: "#b4441d",
          border: "1px solid rgba(180,68,29,0.25)",
        }}
      />

      {/* Item preview placeholder — swap for a real image when assets are ready */}
      <Box
        sx={{
          height: { xs: "30vh", sm: "45vh" },
          bgcolor: "#d3d3d3",
          width: { xs: "90%", sm: "60%" },
          mx: "auto",
          mt: 3,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary" fontWeight={700}>
          Item Preview
        </Typography>
      </Box>
    </Box>
  );
};

export default Reward;