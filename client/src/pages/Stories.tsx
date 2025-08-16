import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Container,
  Card,
  CardActionArea,
} from '@mui/material';
import Bart from '../components/Menut';

const Stories = (): React.ReactElement => {
  return (
    <Box sx={{ backgroundColor: '#dee2e4', minHeight: '100vh', position: 'relative' }}>
      {/* Hamburger */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 6, sm: 7 }, pb: { xs: 6, md: 8 } }}>
        {/* Header */}
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '1.9rem', sm: '2.4rem', md: '3rem' },
            lineHeight: 1.1,
          }}
        >
          Stories
        </Typography>

        {/* All Stories */}
        <Typography
          variant="h4"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.25rem', md: '2rem' },
            mb: { xs: 2, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          All Stories
        </Typography>

        {/* Responsive card grid */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{
            justifyContent: 'center',
            px: { xs: 0, sm: 1 },
          }}
        >
          {['#92a6ba', '#505c68', '#505c68', '#505c68'].map((bg, i) => (
            <Grid key={i} item xs={6} sm={4} md={3}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  bgcolor: bg,
                  aspectRatio: '1 / 1' as any,
                  height: { xs: 140, sm: 160, md: 180 }, // fallback for browsers w/o aspect-ratio
                  mx: 'auto',
                }}
              >
                <CardActionArea
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label={`Open story ${i + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Box
          component="hr"
          sx={{
            width: { xs: '82%', md: '60%' },
            border: 0,
            borderTop: '1.5px solid #000',
            my: { xs: 4, md: 6 },
            mx: 'auto',
          }}
        />

        {/* Unit 1 */}
        <Typography
          variant="h4"
          sx={{
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.25rem', md: '2rem' },
            mb: { xs: 2, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          Unit 1
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          sx={{
            alignItems: { xs: 'stretch', md: 'flex-start' },
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
          }}
        >
          {/* Left Panel */}
          <Box
            sx={{
              backgroundColor: '#92a6ba',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 2, md: 3 },
              p: { xs: 2, sm: 3 },
              flex: { xs: '1 1 100%', md: '1 1 0' }, // grow to fill remaining space
              minWidth: 0,                            // allow content to shrink without overflow
              minHeight: { xs: 220, sm: 240, md: 260 },
            }}
          >
            <Box
              sx={{
                backgroundColor: '#d9d9d9',
                borderRadius: '24px',
                width: { xs: '100%', sm: 180 },
                height: { xs: 160, sm: 180 },
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: { xs: '1.15rem', sm: '1.3rem', md: '1.5rem' } }}
              >
                Momotaro
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 1, fontSize: { xs: '0.95rem', sm: '1rem' } }}
              >
                Read about the adventure of Momotaro and his mission to defeat the oni!
              </Typography>
              <Button
                fullWidth
                sx={{
                  height: { xs: 44, sm: 48, md: 56 },
                  width: '100%',
                  borderRadius: '30px',
                  backgroundColor: '#d3d3d3',
                  border: 'none',
                  fontWeight: 900,
                  mt: { xs: 2, sm: 2.5 },
                  textTransform: 'none',
                  color: '#000',
                  '&:hover': { backgroundColor: '#c0c0c0' },
                }}
              >
                Read &gt;
              </Button>
            </Box>
          </Box>

          {/* Right Panel (actions column) */}
          <Stack
            spacing={2}
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 320px' }, // fixed column on md+
              maxWidth: { md: 340 },
              width: '100%',
              alignSelf: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            <Button
              sx={{
                width: '100%',                // never spills; bounded by the column
                maxWidth: '100%',
                height: { xs: 80, sm: 96, md: 110 },
                backgroundColor: '#d3d3d3',
                borderRadius: '20px',
                border: 'none',
                textTransform: 'none',
                color: '#000',
                '&:hover': { backgroundColor: '#c0c0c0' },
                px: 2,
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Review Vocabulary &gt;
              </Typography>
            </Button>

            <Button
              sx={{
                width: '100%',
                maxWidth: '100%',
                height: { xs: 80, sm: 96, md: 110 },
                backgroundColor: '#d3d3d3',
                borderRadius: '20px',
                border: 'none',
                textTransform: 'none',
                color: '#000',
                '&:hover': { backgroundColor: '#7a92a8' },
                px: 2,
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Learn Grammar &gt;
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Stories;
