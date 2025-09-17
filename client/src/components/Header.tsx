import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, useTheme, useMediaQuery, IconButton, Avatar,
  Menu, MenuItem, Drawer, List, ListItemButton, ListItemText, Divider, Tooltip, CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

type Me = { firstName?: string; lastName?: string; email?: string; rememberMe?: boolean; };

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ME_PATH  = process.env.REACT_APP_ME_PATH  || '/auth/me';
const AUTH_TOKEN_KEY = 'authToken';

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

  // IMPORTANT: token as STATE (not memo) so UI updates after login/logout
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const isAuthed = Boolean(authToken);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthToken(null); // flip UI to "Get Started"
    setMe(null);
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate('/auth');
  };

  const navButtons = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Watch', path: '/watch' },
    { label: 'Talk', path: '/talk' },
    { label: 'Lesson', path: '/lesson' },
  ];

  // Fetch profile whenever token changes
  useEffect(() => {
    const loadMe = async () => {
      if (!authToken) { setMe(null); return; }
      try {
        setLoadingMe(true);
        const res = await fetch(`${API_BASE}${ME_PATH}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 404) { setMe(null); return; }
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch user');
        setMe(data.user ?? data);
      } catch {
        setMe(null);
      } finally {
        setLoadingMe(false);
      }
    };
    loadMe();
  }, [authToken]);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_TOKEN_KEY) {
        setAuthToken(localStorage.getItem(AUTH_TOKEN_KEY));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Refresh token state when tab refocuses (useful if login happened elsewhere in-app)
  useEffect(() => {
    const onFocus = () => setAuthToken(localStorage.getItem(AUTH_TOKEN_KEY));
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center"
         px={{ xs: 2, sm: 4 }} py={2} borderBottom={`1px solid ${theme.palette.divider}`}
         bgcolor={theme.palette.background.paper} position="sticky" top={0} zIndex={1100}>
      {/* Logo */}
      <Typography variant="h6" fontWeight="bold">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Nihon-Go!</a>
      </Typography>

      {/* Desktop */}
      {!isMobile && (
        <Box display="flex" gap={1} alignItems="center">
          {navButtons.map(({ label, path }) => (
            <Button key={label} component={Link} to={path}
              variant={location.pathname === path ? 'contained' : 'text'}
              color={location.pathname === path ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none', fontWeight: location.pathname === path ? 'bold' : 'normal' }}>
              {label}
            </Button>
          ))}

          {!isAuthed ? (
            <Button variant="contained" color="primary" onClick={() => navigate('/auth')}
                    sx={{ textTransform: 'none', ml: 1 }}>
              Get Started
            </Button>
          ) : (
            <Box>
              <Tooltip title={loadingMe ? 'Loading...' : (me ? (`${me.firstName ?? ''} ${me.lastName ?? ''}`.trim() || me.email) : 'Account')}>
                <span>
                  <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {loadingMe ? <CircularProgress size={18} sx={{ color: 'white' }} /> : initialsOf(me?.firstName, me?.lastName)}
                    </Avatar>
                  </IconButton>
                </span>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ elevation: 6, sx:{ mt:1, overflow:'visible', borderRadius:2, minWidth:200,
                      '&:before':{ content:'""', display:'block', position:'absolute', top:0, right:16, width:10, height:10,
                                   bgcolor:'background.paper', transform:'translateY(-50%) rotate(45deg)', zIndex:0 }}}}>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose} sx={{ gap:1 }}>
                  <PersonIcon fontSize="small" /> Profile
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}
                  sx={{ bgcolor:'error.main', color:'error.contrastText', fontWeight:700, borderRadius:1, mx:1, my:0.5,
                        '&:hover':{ bgcolor:'error.dark' }, gap:1, justifyContent:'center' }}>
                  <LogoutIcon fontSize="small" /> Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      )}

      {/* Mobile */}
      {isMobile && (
        <>
          <IconButton aria-label="open navigation" onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
                  PaperProps={{ sx: { width: '80vw', maxWidth: 360 } }}>
            <Box role="presentation" sx={{ pt: 2 }}>
              <Typography variant="h6" sx={{ px: 2, pb: 1 }}>Menu</Typography>
              <Divider />
              <List>
                {navButtons.map(({ label, path }) => (
                  <ListItemButton key={label} component={Link} to={path}
                                  selected={location.pathname === path}
                                  onClick={() => setDrawerOpen(false)}>
                    <ListItemText primary={label} primaryTypographyProps={{ fontWeight: location.pathname === path ? 700 : 500 }} />
                  </ListItemButton>
                ))}
              </List>
              <Divider sx={{ my: 1 }} />
              {!isAuthed ? (
                <Box sx={{ px: 2, py: 1 }}>
                  <Button variant="contained" color="primary" fullWidth sx={{ textTransform: 'none' }}
                    onClick={() => { setDrawerOpen(false); navigate('/auth'); }}>
                    Get Started
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {loadingMe ? '…' : initialsOf(me?.firstName, me?.lastName)}
                    </Avatar>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {me ? (`${me.firstName ?? ''} ${me.lastName ?? ''}`.trim() || me.email) : 'Your Account'}
                    </Typography>
                  </Box>
                  <List>
                    <ListItemButton component={Link} to="/profile" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary="Profile" />
                    </ListItemButton>
                    <ListItemButton onClick={() => { setDrawerOpen(false); handleLogout(); }}>
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
