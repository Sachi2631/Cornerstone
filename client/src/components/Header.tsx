// src/components/Header.tsx

import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';

const Header = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Typography variant="h6" fontWeight="bold">
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Nihon-Go!</a>
      </Typography>

      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={1} mt={isMobile ? 1 : 0}>
        <Button href="/dashboard" fullWidth={isMobile}>Dashboard</Button>
        <Button href="/watch" fullWidth={isMobile}>Watch</Button>
        <Button href="/talk" fullWidth={isMobile}>Talk</Button>
        <Button href="/learn" fullWidth={isMobile}>Learn</Button>
        <Button variant="outlined" href="/register" fullWidth={isMobile}>Register</Button>
        <Button variant="contained" color="primary" href="/login" fullWidth={isMobile}>Log In</Button>
      </Box>
    </Box>
  );
};

export default Header;
