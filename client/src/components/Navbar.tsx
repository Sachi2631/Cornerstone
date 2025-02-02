import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, Avatar, Menu, MenuItem, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    console.log("User logged out");
    navigate('/login');
  };

  return (
    <>
      {/* Top Navbar (Visible when NOT scrolled) */}
      {!isScrolled && (
        <AppBar
          position="static"
          sx={{
            bgcolor: 'white',
            boxShadow: 'none',
            borderBottom: '2px solid #ddd',
          }}
        >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            {/* Left Spacer */}
            <Box sx={{ width: '120px' }} />

            {/* Centered Navigation Links */}
            <Box sx={{ display: 'flex', gap: 3, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {['Home', 'About Us', 'Watch', 'Talk', 'Learn'].map((item, index) => (
                <Button
                  key={index}
                  component={Link}
                  to={`/${item.toLowerCase().replace(/\s/g, '-')}`}
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: '20px',
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    transition: '0.3s',
                    '&:hover': {
                      bgcolor: 'white',
                      color: 'black',
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>

            {/* Right-side Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    bgcolor: 'white',
                    color: 'black',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                to="/signup"
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    bgcolor: 'white',
                    color: 'black',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Signup
              </Button>

              {/* Profile Button */}
              <Avatar
                onClick={handleMenuOpen}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  cursor: 'pointer',
                  width: 40,
                  height: 40,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    bgcolor: 'white',
                    color: 'black',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                P
              </Avatar>

              {/* Dropdown Menu */}
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 1 }}>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'red', fontWeight: 'bold' }}>
                  Log Out
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Floating Sidebar (Appears when scrolled) */}
      {isScrolled && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '20px',
            transform: 'translateY(-50%)',
            width: '150px',
            bgcolor: 'white',
            borderRadius: '12px',
            p: 2,
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
            zIndex: 1100,
          }}
        >
          <List>
            {['Home', 'About Us', 'Watch', 'Talk', 'Learn'].map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={Link} to={`/${item.toLowerCase().replace(/\s/g, '-')}`}>
                  <ListItemText primary={item} sx={{ textAlign: 'center' }} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/profile">
                <ListItemText primary="Profile" sx={{ textAlign: 'center' }} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      )}
    </>
  );
};

export default Navbar;
