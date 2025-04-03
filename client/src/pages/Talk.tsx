import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Talk = (): React.ReactElement  => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={3}
      >
        <Typography variant="h3" mb={3}>
          This is Talk page
        </Typography>
        <Typography variant="h5" mb={5}>
          XXXXXXXX
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/dashboard"
        >
          Start
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default Talk;
