import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Import your hamburger menu component

const FunFacts = (): React.ReactElement => {
    return (
    <Box display="flex" flexDirection="column" alignItems="center" bgcolor="white" minWidth="100vw">
      
      
      <Bart />

    </Box>
  );
};

export default FunFacts;
