import React, { useEffect, useMemo, useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

type Me = {
  firstName?: string;
  lastName?: string;
  email?: string;
  rememberMe?: boolean;
};

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const initialsOf = (first?: string, last?: string) =>
  `${(first?.[0] || '').toUpperCase()}${(last?.[0] || '').toUpperCase()}` || 'U';

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [me, setMe] = useState<Me | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);
  const token = useMemo(() => localStorage.getItem('token'), []);
  const isAuthed = Boolean(token);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isHomePage = location.pathname === '/';

  const navButtons = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Watch', path: '/watch' },
    { label: 'Talk', path: '/talk' },
    { label: 'Learn', path: '/learn' },
  ];

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setMe(null);
        return;
      }
      try {
        setLoadingMe(true);
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch user');
        // Support either { user: {...} } or plain payload
        setMe(data.user ?? data);
      } catch {
        // if token invalid, force logout UX
        setMe(null);
      } finally {
        setLoadingMe(false);
      }
    };
    loadMe();
  }, [token]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      px={{ xs: 2, sm: 4 }}
      py={2}
      borderBottom={`1px solid ${theme.palette.divider}`}
      bgcolor={theme.palette.background.paper}
      position="sticky"
      top={0}
      zIndex={1100}
    >
      {/* Logo */}
      <Typography variant="h6" fontWeight="bold">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Nihon-Go!
        </a>
      </Typography>

      {/* Desktop: inline nav + auth/account */}
      {!isMobile && (
        <Box display="flex" gap={1} alignItems="center">
          {navButtons.map(({ label, path }) => (
            <Button
              key={label}
              component={Link}
              to={path}
              variant={location.pathname === path ? 'contained' : 'text'}
              color={location.pathname === path ? 'primary' : 'inherit'}
              sx={{ fontWeight: location.pathname === path ? 'bold' : 'normal', textTransform: 'none' }}
            >
              {label}
            </Button>
          ))}

          {!isAuthed ? (
            <>
              <Button
                variant="outlined"
                component={Link}
                to="/signup"
                sx={{ textTransform: 'none' }}
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
                sx={{ textTransform: 'none' }}
              >
                Log In
              </Button>
            </>
          ) : (
            <Box>
              <Tooltip
                title={
                  loadingMe
                    ? 'Loading...'
                    : me
                    ? `${me.firstName ?? ''} ${me.lastName ?? ''}`.trim() || me.email
                    : 'Account'
                }
              >
                <span>
                  <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {loadingMe ? (
                        <CircularProgress size={18} sx={{ color: 'white' }} />
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  elevation: 6,
                  sx: {
                    mt: 1,
                    overflow: 'visible',
                    borderRadius: 2,
                    minWidth: 200,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 16,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  to="/profile"
                  onClick={handleMenuClose}
                  sx={{ gap: 1 }}
                >
                  <PersonIcon fontSize="small" />
                  Profile
                </MenuItem>

                <Divider sx={{ my: 0.5 }} />

                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                  sx={{
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    fontWeight: 700,
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    '&:hover': { bgcolor: 'error.dark' },
                    gap: 1,
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      )}

      {/* Mobile: hamburger -> Drawer */}
      {isMobile && (
        <>
          <IconButton aria-label="open navigation" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: '80vw', maxWidth: 360 } }}
          >
            <Box role="presentation" sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ px: 2, pb: 1 }}>
                Menu
              </Typography>
              <Divider />

              {/* Nav items */}
              <List>
                {navButtons.map(({ label, path }) => (
                  <ListItemButton
                    key={label}
                    component={Link}
                    to={path}
                    selected={location.pathname === path}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === path ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>

              <Divider sx={{ my: 1 }} />

              {/* Auth or Account section */}
              {!isAuthed ? (
                <Box sx={{ px: 2, py: 1, display: 'grid', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/signup"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/login"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    Log In
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {loadingMe ? '…' : initialsOf(me?.firstName, me?.lastName)}
                    </Avatar>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {me ? `${me.firstName ?? ''} ${me.lastName ?? ''}`.trim() || me.email : 'Your Account'}
                    </Typography>
                  </Box>
                  <List>
                    <ListItemButton
                      component={Link}
                      to="/profile"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton
                      component={Link}
                      to="/dashboard"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        setDrawerOpen(false);
                        handleLogout();
                      }}
                    >
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </>
              )}
            </Box>
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default Header;
