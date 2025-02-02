import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const categories = [
  { title: 'Lesson', path: '/lesson', icon: <MenuBookIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
  { title: 'Stories', path: '/stories', icon: <AutoStoriesIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
  { title: 'Games', path: '/games', icon: <SportsEsportsIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
  { title: 'Fun Facts', path: '/fun-facts', icon: <EmojiObjectsIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
  { title: 'Histories', path: '/histories', icon: <HistoryEduIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
  { title: 'Resources', path: '/resources', icon: <LibraryBooksIcon sx={{ fontSize: 40, color: '#3f51b5' }} /> },
];

const Learn: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Learn
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary" mb={4}>
            学習の方法を選んで、日本語を楽しく学びましょう！
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {categories.map((category, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  component={Link}
                  to={category.path}
                  sx={{
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 150,
                    textAlign: 'center',
                  }}
                >
                  {category.icon}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                      {category.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Learn;
