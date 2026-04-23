// Navigation.tsx
// FIX: Legacy file — was using hardcoded Replit absolute URLs and raw <a> tags.
// Now uses React Router <Link> components to work correctly within the app.
// NOTE: This component is largely superseded by Header.tsx and Menut.tsx (Bart).
// Keep only if needed for a specific layout; otherwise use Header instead.

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Watch", path: "/watch" },
  { label: "Talk", path: "/talk" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Stories", path: "/stories" },
  { label: "Games", path: "/games" },         // route doesn't exist yet — will 404 to /
  { label: "Gallery", path: "/gallery" },
  { label: "Fun Facts", path: "/funfacts" },
  { label: "Resources", path: "/resources" },
];

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        p: 1,
        bgcolor: "#92a6ba",
      }}
    >
      {navItems.map(({ label, path }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={label}
            to={path}
            style={{
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 6,
              fontWeight: active ? 800 : 600,
              color: active ? "#b4441d" : "#111",
              backgroundColor: active ? "rgba(255,255,255,0.85)" : "transparent",
            }}
          >
            {label}
          </Link>
        );
      })}
    </Box>
  );
};

export default Navigation;