// src/components/Footer.tsx

//Need to remove the overflow x axis
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer = (): React.ReactElement => {
  return (
    <Box mt="auto" py={4} px={2} borderTop="2px solid #ddd" textAlign="center">
      <Typography variant="body2" mb={1}>
        © 2025 Nihon-Go! All Rights Reserved
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button size="small">About Us</Button>
        <Button size="small">Donate</Button>
        <Button size="small">FAQs</Button>
        <Button size="small">Help Center</Button>
        <Button size="small">Contact</Button>
        <Button size="small">Mobile App</Button>
      </Box>
    </Box>
  );
};

export default Footer;