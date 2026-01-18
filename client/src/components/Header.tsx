// src/components/Header.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
  CircularProgress,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, clearToken, json } from "../services/api";

type Me = {
  firstName?: string;
  lastName?: string;
  email?: string;
  rememberMe?: boolean;
};

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  const headerRef = useRef<HTMLDivElement | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);

  // Keep token in state so UI updates after login/logout
  const [authToken, setAuthToken] = useState<string | null>(() => getToken());
  const isAuthed = Boolean(authToken);

  const navButtons = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Watch", path: "/watch" },
      { label: "Talk", path: "/talk" },
      { label: "Lesson", path: "/lesson" },
    ],
    []
  );

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    clearToken();
    setAuthToken(getToken());
    setMe(null);
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate("/auth");
  };

  const initialsOf = (first?: string, last?: string) =>
    (`${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}` || "U");

  const displayName =
    loadingMe
      ? "Loading..."
      : me
        ? (`${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email)
        : "Account";

  const isActive = (path: string) => location.pathname === path;

  // ✅ Publish header height to CSS var (Menut can align to it)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--app-header-height", `${Math.round(h)}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    // also set on next frame (fonts load, etc.)
    const t = window.setTimeout(setVar, 50);

    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Fetch profile whenever token changes
  useEffect(() => {
    const loadMe = async () => {
      const token = getToken();
      if (!token) {
        setMe(null);
        return;
      }
      try {
        setLoadingMe(true);
        const data = await json<{ user?: Me } | Me>("/api/auth/me");
        setMe((data as any).user ?? (data as any));
      } catch {
        setMe(null);
        setAuthToken(getToken());
      } finally {
        setLoadingMe(false);
      }
    };
    loadMe();
  }, [authToken]);

  // Sync auth token across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAuthToken(getToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Refresh token state when tab refocuses
  useEffect(() => {
    const onFocus = () => setAuthToken(getToken());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <Box
      component="header"
      ref={headerRef}
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "#fff",
        backdropFilter: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 2000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 1.5, sm: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: { xs: 1.25, sm: 1.5 },
            minHeight: 64,
            overflowX: "hidden",
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 1,
              minWidth: 0,
            }}
            aria-label="Go to home"
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: "rgba(180,61,32,0.12)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontWeight: 900, color: "#b43d20", lineHeight: 1 }}>日</Typography>
            </Box>

            <Typography
              variant="h6"
              fontWeight={900}
              sx={{
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Nihon-Go!
            </Typography>
          </Box>

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {navButtons.map(({ label, path }) => (
                  <Button
                    key={label}
                    component={Link}
                    to={path}
                    disableElevation
                    sx={{
                      textTransform: "none",
                      fontWeight: isActive(path) ? 800 : 600,
                      px: 1.2,
                      borderRadius: 2,
                      color: isActive(path) ? "#b43d20" : "text.primary",
                      position: "relative",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: 6,
                        height: 2,
                        borderRadius: 999,
                        bgcolor: "#b43d20",
                        transform: isActive(path) ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "center",
                        transition: "transform 180ms ease",
                      },
                      "&:hover": {
                        bgcolor: "rgba(180,61,32,0.06)",
                        "&:after": { transform: "scaleX(1)" },
                      },
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>

              {!isAuthed ? (
                <Button
                  variant="contained"
                  onClick={() => navigate("/auth")}
                  sx={{
                    textTransform: "none",
                    ml: 1,
                    bgcolor: "#b43d20",
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#9f341b" },
                  }}
                >
                  Get Started
                </Button>
              ) : (
                <Box>
                  <Tooltip title={displayName}>
                    <span>
                      <IconButton
                        onClick={handleMenuOpen}
                        size="large"
                        sx={{
                          p: 0,
                          borderRadius: 999,
                          border: "1px solid rgba(0,0,0,0.08)",
                          overflow: "hidden",
                        }}
                        aria-label="Open account menu"
                      >
                        <Avatar sx={{ bgcolor: "#b43d20", width: 40, height: 40 }}>
                          {loadingMe ? (
                            <CircularProgress size={18} sx={{ color: "white" }} />
                          ) : (
                            initialsOf(me?.firstName, me?.lastName)
                          )}
                        </Avatar>
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      elevation: 10,
                      sx: {
                        mt: 1,
                        borderRadius: 2.5,
                        minWidth: 220,
                        overflow: "visible",
                        border: "1px solid rgba(0,0,0,0.08)",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 18,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          borderLeft: "1px solid rgba(0,0,0,0.08)",
                          borderTop: "1px solid rgba(0,0,0,0.08)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.75, fontWeight: 800 }}>
                        Signed in as
                      </Typography>
                      <Typography variant="body2" fontWeight={800} noWrap>
                        {me ? (`${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email) : "Your Account"}
                      </Typography>
                    </Box>

                    <Divider />

                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={handleMenuClose}
                      sx={{ gap: 1.25, py: 1.25 }}
                    >
                      <PersonIcon fontSize="small" /> Profile
                    </MenuItem>

                    <Box sx={{ px: 1, pb: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          handleMenuClose();
                          handleLogout();
                        }}
                        startIcon={<LogoutIcon />}
                        sx={{
                          mt: 0.5,
                          bgcolor: "error.main",
                          fontWeight: 900,
                          textTransform: "none",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                      >
                        Logout
                      </Button>
                    </Box>
                  </Menu>
                </Box>
              )}
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isAuthed && (
                <Tooltip title={displayName}>
                  <Avatar sx={{ bgcolor: "#b43d20", width: 34, height: 34, fontSize: 14 }}>
                    {loadingMe ? "…" : initialsOf(me?.firstName, me?.lastName)}
                  </Avatar>
                </Tooltip>
              )}

              <IconButton aria-label="open navigation" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{
                  keepMounted: true,
                  sx: { zIndex: 3000 },
                }}
                PaperProps={{
                  sx: {
                    width: "82vw",
                    maxWidth: 360,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    overflowX: "hidden",
                  },
                }}
              >
                <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={900}>
                      Menu
                    </Typography>
                    <Button
                      onClick={() => setDrawerOpen(false)}
                      sx={{ textTransform: "none", fontWeight: 800, color: "#b43d20" }}
                    >
                      Close
                    </Button>
                  </Box>

                  {isAuthed && (
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                      <Avatar sx={{ bgcolor: "#b43d20" }}>
                        {loadingMe ? "…" : initialsOf(me?.firstName, me?.lastName)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 800 }}>
                          Signed in
                        </Typography>
                        <Typography variant="body1" fontWeight={900} noWrap>
                          {me ? (`${me.firstName ?? ""} ${me.lastName ?? ""}`.trim() || me.email) : "Your Account"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider />

                <List sx={{ py: 0 }}>
                  {navButtons.map(({ label, path }) => (
                    <ListItemButton
                      key={label}
                      component={Link}
                      to={path}
                      selected={isActive(path)}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        py: 1.25,
                        "&.Mui-selected": {
                          bgcolor: "rgba(180,61,32,0.10)",
                          "&:hover": { bgcolor: "rgba(180,61,32,0.14)" },
                        },
                      }}
                    >
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          fontWeight: isActive(path) ? 900 : 700,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>

                <Divider sx={{ my: 1 }} />

                {!isAuthed ? (
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        textTransform: "none",
                        bgcolor: "#b43d20",
                        fontWeight: 900,
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#9f341b" },
                      }}
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/auth");
                      }}
                    >
                      Get Started
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 900,
                        borderWidth: 2,
                        borderColor: "#b43d20",
                        color: "#b43d20",
                        "&:hover": {
                          borderWidth: 2,
                          borderColor: "#9f341b",
                          bgcolor: "rgba(180,61,32,0.06)",
                        },
                      }}
                      component={Link}
                      to="/profile"
                      onClick={() => setDrawerOpen(false)}
                      startIcon={<PersonIcon />}
                    >
                      Profile
                    </Button>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1.25,
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 900,
                        bgcolor: "error.main",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                      onClick={() => {
                        setDrawerOpen(false);
                        handleLogout();
                      }}
                      startIcon={<LogoutIcon />}
                    >
                      Logout
                    </Button>
                  </Box>
                )}
              </Drawer>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
