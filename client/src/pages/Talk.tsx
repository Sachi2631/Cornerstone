import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';

const Talk: React.FC = () => {
  const discussions = [
    { title: "怪我を防ぐ方法", author: "アリス", date: "2025年2月2日" },
    { title: "最高のウォームアップ", author: "ボブ", date: "2025年1月30日" },
    { title: "バレエシューズの選び方", author: "チャーリー", date: "2025年1月28日" },
  ];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" textAlign="center" gutterBottom>
            Talk
          </Typography>
          <Typography variant="h6" textAlign="center" color="textSecondary" mb={4}>
            ディスカッションに参加して、他のバレエ愛好者と交流しましょう。
          </Typography>

          <Grid container spacing={3} direction="row" justifyContent="center">
            {discussions.map((discussion, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{discussion.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {discussion.author} - {discussion.date}
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

export default Talk;
