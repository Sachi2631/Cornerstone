import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Lesson: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center">
            Lesson
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary">
            日本語の基本を学びましょう！
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Lesson;
