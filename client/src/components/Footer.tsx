import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        bgcolor: 'grey.900',
        color: 'white',
        mt: 'auto', // Pushes footer to the bottom
        width: '100%',
      }}
    >
      <Typography variant="body2">© {new Date().getFullYear()} My App. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
