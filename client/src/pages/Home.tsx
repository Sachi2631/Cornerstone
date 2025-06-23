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
    <Box
        // py={20}
        textAlign="center"
        mx={isMobile ? 3 : 6}
        my={5}
        // bgcolor="#CCCCFF"
        // bgcolor="#fffbed"
        bgcolor="#dfe2e5"
      >
       <Box
        sx={{
          bgcolor:"cerulean",
          height:"65vh",
          marginTop:"0px",
          display:"flex",
          flexDirection:"column",
          justifyContent:"space-between",
        }}
        >
                 
          <Box sx={{paddingTop:"20vh"}}>
            <Typography variant={isMobile ? "h3" : "h2"} fontWeight="bold" gutterBottom>Nihon-go!</Typography>
            <Typography variant="h6" mb={4}>Learn Japanese in a fun, effective, and cultural way!</Typography>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={4}>
              <Button variant="contained" sx={{ backgroundColor: '#b43d20', color: '#dfe2e5', height:"5vh", width:"10vw"}}> Start Now! </Button>
              <Button variant="outlined" sx={{ color: '#b43d20', borderColor: '#b43d20', borderWidth:"5px", height:"5vh", width:"10vw"}} href="#info"> Learn more </Button>
            </Box>
          </Box>

          <Box textAlign="left" display="flex" flexDirection="row" marginBottom={-5}>
            <img
              src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png"
              alt="Cat"
              style={{ width: 100, marginBottom: 16 }}
            />
            <Box alignItems="center" paddingTop={2}>
              <Typography variant="h5" gutterBottom style={{fontWeight:"600"}}>Shinjuku</Typography>
              <Typography variant="h6">This is Shinjuku! It's the capital of Tokyo Prefecture. </Typography>
            </Box>
          </Box>
        </Box>

      {/* About Section */}
      <Box id="info" bgcolor="#91a7b9" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={10} borderRadius={4}>
        <Container maxWidth="md">
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
            About Us
          </Typography>
          <Typography paragraph align="center">
            Many language learning programs exist – but many aren’t fun, interesting, or teach useful real-world phrases.
            Our goal is to build a website that helps you learn practical Japanese for everyday life, emergencies, and work.
          </Typography>
          <Typography paragraph align="center">
            We are Sara and Sachi, juniors at KLS, and we built this platform for curious, passionate learners who want
            to enjoy Japanese language and culture. Here, you’ll find music, games, history, events, and more to help you
            thrive in Japan.
          </Typography>
        </Container>
      </Box>

      {/* Feature Section */}
      <Box bgcolor="#d3d3d3" py={8} px={{ xs: 3, md: 6 }} mx={{ xs: 2, md: 6 }} mt={6} borderRadius={4}>
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
                Learn Useful Japanese
              </Typography>
              <Typography variant="body2">
                Learn practical Japanese for your daily life. After completing the basics, 
                you can choose between multiple routes, including learning financial or emergency medical 
                terminology, work culture, navigating places, and more!
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
                Gamified  Learning
              </Typography>
              <Typography variant="body2">
                Our app is gamefied to increase motivation. There is a reward system of collecting points and objects, you can 
                choose to have a character to represent you -- such as Japanese mythical creatures or animals only unique to Japan -- 
                and travel around the country as you advance!
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
                All-Encompassing
              </Typography>
              <Typography variant="body2">
                Integrate your language aquisition with lessons of Japanese history, geography, society, folklore, and culture! 
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box bgcolor="#91a7b9" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={6} borderRadius={4}>
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
      <Box bgcolor="#d3d3d3" py={8} px={isMobile ? 3 : 6} mx={isMobile ? 2 : 6} mt={6} borderRadius={4}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" gutterBottom>Contact Us</Typography>
            <Typography mb={2}>
              Don't hesitate to reach out if you have feedback, questions, or new ideas!
            </Typography>
            <Typography fontWeight="medium" color="primary">Sachi and Sara (Juniors)</Typography>

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