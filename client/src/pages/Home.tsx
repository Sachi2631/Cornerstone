import React from 'react';
import {
  Box, Card, CardContent, Typography, Button, Container
} from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // TODO: Replace with your real auth state (e.g., context/store selector)
  const isAuthed = Boolean(localStorage.getItem('authToken'));

  const go = (loggedInPath: string, publicPath: string) => {
    navigate(isAuthed ? loggedInPath : publicPath);
  };

  const sectionBox = (bgcolor: string, content: React.ReactNode, mt = 6) => (
    <Box bgcolor={bgcolor} py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={mt} borderRadius={4}>
      <Container>{content}</Container>
    </Box>
  );

  const featureCard = (title: string, desc: string) => (
    <Box
      sx={{
        flex: '1 1 280px', maxWidth: 320, bgcolor: 'white',
        borderRadius: 3, boxShadow: 3, p: 3, textAlign: 'center'
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>{title}</Typography>
      <Typography variant="body2">{desc}</Typography>
    </Box>
  );

  return (
    <Box textAlign="center" mx={isMobile ? 3 : 6} my={5} bgcolor="#dfe2e5">
      {/* Hero */}
      <Box sx={{
        bgcolor: 'cerulean', height: '65vh', mt: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <Box sx={{ pt: '20vh' }}>
          <Typography variant={isMobile ? 'h3' : 'h2'} fontWeight="bold" gutterBottom>Nihon-go!</Typography>
          <Typography variant="h6" mb={4}>Learn Japanese in a fun, effective, and cultural way</Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={4}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#b43d20', color: '#dfe2e5', height: "7vh", width: isMobile ? "60vw" : "15vw", borderRadius: "10px" }}
              onClick={() => go('/dashboard', '/auth')}
            >
              Start Now!
            </Button>
            <Button
              variant="outlined"
              sx={{ color: '#b43d20', borderColor: '#b43d20', borderWidth: 3, height: "7vh", width: isMobile ? "60vw" : "15vw", borderRadius: "10px" }}
              onClick={() => go('/lesson', '/auth')}
            >
              Learn more
            </Button>
          </Box>
        </Box>
        <Box display="flex" mb={-5} textAlign="left">
          <img src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png" alt="Cat" style={{ width: 100, marginBottom: 16 }} />
          <Box pt={2}>
            <Typography variant="h5" fontWeight={600} gutterBottom>Shinjuku</Typography>
            <Typography variant="h6">This is Shinjuku! It's the capital of Tokyo Prefecture.</Typography>
          </Box>
        </Box>
      </Box>

      {/* About */}
      {sectionBox("#91a7b9", <>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">About Us</Typography>
        <Typography paragraph align="center">
          Many language learning programs exist – but many aren’t fun, interesting, or teach useful real-world phrases.
          Our goal is to build a website that helps you learn practical Japanese for everyday life, emergencies, and work.
        </Typography>
        <Typography paragraph align="center">
          We are Sara and Sachi, juniors at KLS, and we built this platform for curious, passionate learners who want
          to enjoy Japanese language and culture. Here, you’ll find music, games, history, events, and more to help you thrive in Japan.
        </Typography>
      </>, 10)}

      {/* Features */}
      {sectionBox("#d3d3d3", <>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">Features</Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4} mt={4}>
          {featureCard("Learn Useful Japanese", "Learn practical Japanese for your daily life. After completing the basics, you can choose between multiple routes, including learning financial or emergency medical terminology, work culture, navigating places, and more!")}
          {featureCard("Gamified Learning", "Our app is gamefied to increase motivation. Collect points and objects, pick a character (mythical creatures or unique Japanese animals), and travel around Japan as you level up!")}
          {featureCard("All-Encompassing", "Integrate your language acquisition with lessons on Japanese history, geography, society, folklore, and culture!")}
        </Box>
      </>)}

      {/* Testimonials */}
      {sectionBox("#91a7b9", <>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">Testimonials</Typography>
        <Box display="flex" justifyContent="center" gap={3} mt={4} flexWrap="wrap">
          {[1, 2, 3].map((p) => (
            <Card key={p} elevation={3} sx={{ flex: '1 1 280px', maxWidth: 320, px: 2, py: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Person {p}</Typography>
                <Typography variant="body2">“This app made learning Japanese so fun and practical. I love the cultural bits too!”</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </>)}

      {/* Contact */}
      {sectionBox("#d3d3d3", (
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" gutterBottom>Contact Us</Typography>
          <Typography mb={2}>Don't hesitate to reach out if you have feedback, questions, or new ideas!</Typography>
          <Typography fontWeight="medium" color="primary">Sachi and Sara (Juniors)</Typography>
          <Box mt={5}>
            <Typography variant="h6" gutterBottom>Support our website!</Typography>
            <Button variant="outlined" size="large">Donate</Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Home;
