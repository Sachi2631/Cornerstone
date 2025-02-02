import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Home: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to bottom, #E3F2FD, #ffffff)',
        color: '#333',
        textAlign: 'center',
        p: 3,
      }}
    >
      {/* Hero Section */}
      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={3}
        sx={{ py: 6 }}
      >
        <Typography variant="h2" mb={3} fontWeight="bold" sx={{ color: '#2A2A72' }}>
          Welcome
        </Typography>
        <Typography variant="h5" mb={5} sx={{ color: '#444' }}>
          Discover, Learn, and Connect
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #4A90E2, #FF6F61)',
            color: 'white',
            borderRadius: '25px',
            px: 4,
            py: 1,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            transition: '0.3s',
            '&:hover': {
              background: 'linear-gradient(to right, #FF6F61, #4A90E2)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
          href="/dashboard"
        >
          Get Started
        </Button>
      </Box>

      {/* What Can You Do? Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: '#2A2A72' }}>
          What Can You Do?
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: 'Learn Japanese', desc: 'Access structured lessons and interactive exercises.', color: '#FF6F61' },
            { title: 'Watch & Listen', desc: 'Enjoy curated videos, podcasts, and live lessons.', color: '#4A90E2' },
            { title: 'Engage in Discussions', desc: 'Join conversations with fellow learners and experts.', color: '#F4A261' },
            { title: 'Play Games', desc: 'Reinforce your learning with fun language games.', color: '#2A2A72' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: `3px solid ${item.color}`,
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0px 6px 16px rgba(0,0,0,0.15)', transform: 'scale(1.05)' },
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: item.color }}>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: '#2A2A72' }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={3}>
          {[
            { name: 'Emily R.', review: 'This platform made learning Japanese so much easier! The lessons are engaging and fun.' },
            { name: 'Michael T.', review: 'I love the interactive exercises and discussions. It’s like having a real classroom online!' },
            { name: 'Sophia L.', review: 'The best part is the games! They reinforce what I learn in a fun way.' },
          ].map((testimonial, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  border: '2px solid #4A90E2',
                  '&:hover': { transform: 'scale(1.05)', transition: '0.3s' },
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  "{testimonial.review}"
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: '#2A2A72' }}>
          Frequently Asked Questions
        </Typography>
        {[
          { question: 'Is this platform free to use?', answer: 'Yes! We offer a free plan with essential features, and a premium plan for more resources.' },
          { question: 'How do I start learning?', answer: 'Simply click the "Get Started" button at the top and begin your journey!' },
          { question: 'Do you offer live lessons?', answer: 'Yes! Our premium plan includes live sessions with experienced instructors.' },
        ].map((faq, index) => (
          <Accordion key={index} sx={{ mb: 2, border: '1px solid #ddd' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>
              {faq.question}
            </AccordionSummary>
            <AccordionDetails>{faq.answer}</AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* Join Us Section */}
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: '#2A2A72' }}>
          Join Our Community!
        </Typography>
        <Typography variant="body1" mb={4} color="textSecondary">
          Become part of a growing community of Japanese learners and enthusiasts. Sign up today and take your first step towards fluency!
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #4A90E2, #FF6F61)',
            color: 'white',
            borderRadius: '25px',
            px: 4,
            py: 1,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            transition: '0.3s',
            '&:hover': {
              background: 'linear-gradient(to right, #FF6F61, #4A90E2)',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
          href="/signup"
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
