import React, { useState } from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isHomePage = location.pathname === '/';

  const navButtons = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Watch', path: '/watch' },
    { label: 'Talk', path: '/talk' },
    { label: 'Learn', path: '/learn' },
  ];

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      px={{ xs: 2, sm: 4 }}
      py={2}
      borderBottom="2px solid #ddd"
      bgcolor="white"
      position="sticky"
      top={0}
      zIndex={2}
      marginTop="-10px"
      marginLeft="-10px"
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
              href={path}
              variant={location.pathname === path ? 'contained' : 'text'}
              color={location.pathname === path ? 'primary' : 'inherit'}
              sx={{ fontWeight: location.pathname === path ? 'bold' : 'normal', textTransform: 'none' }}
            >
              {label}
            </Button>
          ))}

          {isHomePage ? (
            <>
              <Button variant="outlined" href="/signup" sx={{ textTransform: 'none' }}>
                Sign Up
              </Button>
              <Button variant="contained" color="primary" href="/login" sx={{ textTransform: 'none' }}>
                Log In
              </Button>
            </>
          ) : (
            <Box>
              <IconButton onClick={handleMenuOpen} size="large" sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#FF6700' }}>U</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleMenuClose}>Account</MenuItem>
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
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
                    component="a"
                    href={path}
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
              {isHomePage ? (
                <Box sx={{ px: 2, py: 1, display: 'grid', gap: 1 }}>
                  <Button variant="outlined" href="/signup" fullWidth sx={{ textTransform: 'none' }} onClick={() => setDrawerOpen(false)}>
                    Sign Up
                  </Button>
                  <Button variant="contained" color="primary" href="/login" fullWidth sx={{ textTransform: 'none' }} onClick={() => setDrawerOpen(false)}>
                    Log In
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#FF6700' }}>U</Avatar>
                    <Typography variant="body1" fontWeight={600}>
                      Your Account
                    </Typography>
                  </Box>
                  <List>
                    <ListItemButton onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary="Account" />
                    </ListItemButton>
                    <ListItemButton onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary="Profile" />
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
