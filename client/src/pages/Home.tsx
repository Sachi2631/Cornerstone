import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';

const Home = (): React.ReactElement => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Hero Section */}
      <Box
        py={10}
        textAlign="center"
        border="4px dashed black"
        mx={isMobile ? 2 : 6}
        borderRadius={4}
      >
        <Typography variant={isMobile ? 'h3' : 'h2'} fontWeight="bold" gutterBottom>
          Nihon-go!
        </Typography>
        <Typography variant="h6" mb={4}>
          Learn Japanese in a fun, effective, and cultural way!
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={4}>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary">Sign Up</Button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">Log In</Button>
          </Link>
        </Box>

        <img
          src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png"
          alt="Cat"
          style={{ width: 100, marginBottom: 16 }}
        />
        <Typography variant="h5" gutterBottom>Shinjuku</Typography>
        <Typography>This is Shinjuku! It's the capital of Tokyo Prefecture.</Typography>
      </Box>

      {/* About Section */}
      <Box id="info" bgcolor="#f3f0fc" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={6} borderRadius={4}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            About Us
          </Typography>
          <Typography paragraph align="center">
            Many language learning programs exist – but many aren’t fun, interesting, or teach useful real-world phrases.
            Our goal is to build a website that helps you learn practical Japanese for everyday life, emergencies, and work.
          </Typography>
          <Typography paragraph align="center">
            We are Sara and Sachi, sophomores at KLS, and we built this platform for curious, passionate learners who want
            to enjoy Japanese language and culture. Here, you’ll find music, games, history, events, and more to help you
            thrive in Japan.
          </Typography>
        </Container>
      </Box>

      {/* Feature Section */}
      <Box bgcolor="#e6f9f8" py={8} px={{ xs: 3, md: 6 }} mx={{ xs: 2, md: 6 }} mt={6} borderRadius={4}>
        <Container maxWidth="lg">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            Features
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap={4}
            justifyContent="center"
            mt={4}
          >
            {/* Feature 1 */}
            <Box
              sx={{
                flex: '1 1 280px',
                maxWidth: '320px',
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Interactive Learning Journey
              </Typography>
              <Typography variant="body2">
                Explore Japanese language and culture through rich, dynamic visualizations that track your learning path.
              </Typography>
            </Box>

            {/* Feature 2 */}
            <Box
              sx={{
                flex: '1 1 280px',
                maxWidth: '320px',
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Task Manager & Reminders
              </Typography>
              <Typography variant="body2">
                Stay on top of your goals with to-do lists, task checklists, and gentle reminders to keep you progressing.
              </Typography>
            </Box>

            {/* Feature 3 */}
            <Box
              sx={{
                flex: '1 1 280px',
                maxWidth: '320px',
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                All-in-One Learning Platform
              </Typography>
              <Typography variant="body2">
                Integrate your Learn, Watch, and Talk activities seamlessly in one comprehensive and accessible platform.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bgcolor="#e6f9f8" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={6} borderRadius={4}>
        <Container>
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            Testimonials
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={4} gap={2} flexWrap="wrap">
            <Box
              display="flex"
              flexWrap="wrap"
              gap={3}
              justifyContent="center"
              flex="1 1 auto"
            >
              {[1, 2, 3].map((person) => (
                <Card
                  key={person}
                  elevation={3}
                  sx={{
                    flex: '1 1 280px',
                    maxWidth: 320,
                    px: 2,
                    py: 3,
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Person {person}</Typography>
                    <Typography variant="body2">
                      “This app made learning Japanese so fun and practical. I love the cultural bits too!”
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box bgcolor="#fdf6f9" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={6} borderRadius={4}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" gutterBottom>Contact Us</Typography>
            <Typography mb={2}>
              Don't hesitate to reach out if you have feedback, questions, or new ideas!
            </Typography>
            <Typography fontWeight="medium" color="primary">nihonog@gmail.com</Typography>

            <Box mt={5}>
              <Typography variant="h6" gutterBottom>Support our website!</Typography>
              <Button variant="outlined" size="large">Donate</Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
