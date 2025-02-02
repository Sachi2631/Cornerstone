import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const About: React.FC = () => {
  return (
    <Box flexGrow={1} sx={{ py: 6, px: 3, bgcolor: '#ffffff', minHeight: '100vh', textAlign: 'center' }}>
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 6,
            borderRadius: 4,
            bgcolor: 'white',
            textAlign: 'center',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            gutterBottom
            sx={{ color: '#3f51b5', fontWeight: 'bold', mb: 3 }}
          >
            About Us!
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333' }}>
            Many language learning programs exist – but many aren’t fun, interesting, or engaging, and they don't teach 
            necessary and real-world useful topics or phrases. In fact, some even teach very impractical phrases that 
            you might never use. Therefore, our goal is to create a website or guide that teaches you how to learn Japanese.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', lineHeight: 1.8, color: '#333' }}>
            Our names are <strong>Sara and Sachi</strong>, juniors in KLS, and our purpose is to create a website for 
            language learners – people who want to learn for fun and acquire useful knowledge in an efficient, engaging, 
            free, and enjoyable way! We have added many features so you can learn Japanese while enjoying the process. 
            Not only will you learn the language, but also aspects of Japanese culture – such as major music, events, 
            games, and movies that are important in Japan.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
