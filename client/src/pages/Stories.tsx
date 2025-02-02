import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Stories: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center">
            Stories
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary">
            日本の物語や伝説を楽しみましょう！
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Stories;
