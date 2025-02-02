import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Games: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center">
            Games
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary">
            楽しいゲームで日本語を学びましょう！
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Games;
