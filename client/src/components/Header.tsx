// src/components/Header.tsx

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
} from '@mui/material';
import { useLocation } from 'react-router-dom';

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      flexDirection={isMobile ? 'column' : 'row'}
      justifyContent="space-between"
      alignItems="center"
      px={isMobile ? 2 : 4}
      py={2}
      borderBottom="2px solid #ddd"
      bgcolor="white"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      {/* Logo */}
      <Typography variant="h6" fontWeight="bold">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Nihon-Go!
        </a>
      </Typography>

      {/* Navigation + Buttons */}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={1}
        mt={isMobile ? 1 : 0}
        alignItems="center"
      >
        {navButtons.map(({ label, path }) => (
          <Button
            key={label}
            href={path}
            fullWidth={isMobile}
            variant={location.pathname === path ? 'contained' : 'text'}
            color={location.pathname === path ? 'primary' : 'inherit'}
            sx={{
              fontWeight: location.pathname === path ? 'bold' : 'normal',
              textTransform: 'none',
            }}
          >
            {label}
          </Button>
        ))}

        {/* Auth/Menu Buttons */}
        {isHomePage ? (
          <>
            <Button
              variant="outlined"
              href="/signup"
              fullWidth={isMobile}
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              color="primary"
              href="/login"
              fullWidth={isMobile}
              sx={{ textTransform: 'none' }}
            >
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
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>Account</MenuItem>
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
