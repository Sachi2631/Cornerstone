import React from "react";
import { Box, Typography } from "@mui/material";

interface FactProps {
  title: string;
  description: string;
}

const Fact: React.FC<FactProps> = ({ title, description }) => {
  return (
    // FIX: replaced raw divs + inline styles with MUI Box for responsiveness
    <Box sx={{ textAlign: "center", py: 2 }}>
      <Box
        sx={{
          backgroundColor: "#d9d9d9",
          border: "2px solid #505c68",
          borderRadius: "12px",
          // FIX: min-height instead of fixed height so long text doesn't clip
          minHeight: 150,
          // FIX: responsive width instead of hard-coded 40vw
          width: { xs: "92%", sm: "70%", md: "50%" },
          mx: "auto",
          p: 3,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" }, mt: 2 }}>
          {description}
        </Typography>
      </Box>

      <Box
        component="img"
        src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png"
        alt="Cat Icon"
        sx={{ height: { xs: "18vh", sm: "28vh" }, mt: 2 }}
      />
    </Box>
  );
};

export default Fact;