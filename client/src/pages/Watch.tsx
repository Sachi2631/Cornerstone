import React from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';

const Watch: React.FC = () => {
  const videos = [
    { title: "バレエの基本", thumbnail: "https://via.placeholder.com/300x200", link: "#" },
    { title: "上級テクニック", thumbnail: "https://via.placeholder.com/300x200", link: "#" },
    { title: "怪我の予防", thumbnail: "https://via.placeholder.com/300x200", link: "#" },
  ];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Watch
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary" mb={4}>
            動画、パフォーマンス、専門家の見解を探索してください。
          </Typography>

          <Grid container spacing={3} direction="row" justifyContent="center">
            {videos.map((video, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardMedia component="img" height="200" image={video.thumbnail} alt={video.title} />
                  <CardContent>
                    <Typography variant="h6">{video.title}</Typography>
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

export default Watch;
