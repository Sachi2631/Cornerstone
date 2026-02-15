// src/components/Header.tsx
import React, { useMemo, useState, useEffect } from "react";
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
};

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
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

  const isActive = (path: string) => location.pathname === path;

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

  useEffect(() => {
    const loadMe = async () => {
      const token = getToken();
      if (!token) return setMe(null);
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

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") setAuthToken(getToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const onFocus = () => setAuthToken(getToken());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        height: 64,
        minHeight: 64,
        bgcolor: "#fff",
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: 2000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
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
            }}
          >
            <Typography variant="h6" fontWeight={900}>
              Nihon-Go!
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {navButtons.map(({ label, path }) => (
                <Button
                  key={label}
                  component={Link}
                  to={path}
                  sx={{
                    fontWeight: isActive(path) ? 800 : 600,
                    color: isActive(path) ? "#b43d20" : "text.primary",
                  }}
                >
                  {label}
                </Button>
              ))}

              {!isAuthed ? (
                <Button
                  variant="contained"
                  onClick={() => navigate("/auth")}
                  sx={{ bgcolor: "#b43d20" }}
                >
                  Get Started
                </Button>
              ) : (
                <>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Avatar sx={{ bgcolor: "#b43d20" }}>
                      {loadingMe ? (
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      ) : (
                        initialsOf(me?.firstName, me?.lastName)
                      )}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem component={Link} to="/profile">
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <List>
              {navButtons.map(({ label, path }) => (
                <ListItemButton
                  key={label}
                  component={Link}
                  to={path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}
            </List>
          </Drawer>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
