import React from "react";
import { Box, Typography, Button, Container, Divider, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = (): React.ReactElement => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: "1px solid rgba(0,0,0,0.10)",
        overflowX: "hidden", // ✅ hard guard
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ py: { xs: 4, sm: 5 } }}>
          {/* Top row */}
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
                Nihon-Go!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
                Learn Japanese in a fun, effective, and cultural way.
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#b43d20",
                fontWeight: 900,
                borderRadius: 2,
                px: 2.5,
                minHeight: 44,
                "&:hover": { bgcolor: "#9f341b" },
                width: { xs: "100%", sm: "auto" },
              }}
              component={Link}
              to="/auth"
            >
              Get Started
            </Button>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 3.5 } }} />

          {/* Links */}
          <Stack
            direction="row"
            useFlexGap
            flexWrap="wrap"
            spacing={1}
            sx={{
              justifyContent: { xs: "center", sm: "flex-start" },
              rowGap: 1,
              overflowX: "hidden",
            }}
          >
            {[
              { label: "About Us", to: "/about" },
              { label: "Donate", to: "/donate" },
              { label: "FAQs", to: "/faqs" },
              { label: "Help Center", to: "/help" },
              { label: "Contact", to: "/contact" },
              { label: "Mobile App", to: "/mobile" },
            ].map((x) => (
              <Button
                key={x.label}
                component={Link}
                to={x.to}
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: 999,
                  px: 1.25,
                  "&:hover": { bgcolor: "rgba(180,61,32,0.06)" },
                }}
              >
                {x.label}
              </Button>
            ))}
          </Stack>

          <Divider sx={{ my: { xs: 3, sm: 3.5 } }} />

          {/* Bottom row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              © 2025 Nihon-Go! All Rights Reserved
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.65 }}>
              Built with ❤️ for curious learners
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
