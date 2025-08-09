import React from 'react';
import { Box, Typography, Button, Grid, Stack } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Your hamburger menu

const Stories = (): React.ReactElement => {
  return (
    <Box
      sx={{
        textAlign: 'right',
        backgroundColor: '#dee2e4',
        minHeight: '100vh',
        pb: { xs: 6, md: 8 },
        pt: { xs: 2, md: 4 },
      }}
    >
      {/* Hamburger */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      {/* Header */}
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          mb: { xs: 3, md: 4 },
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
          lineHeight: 1.1,
        }}
      >
        Stories
      </Typography>

      {/* All Stories */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
          ml: { xs: '6vw', md: '10vw' },
          fontSize: { xs: '1.25rem', md: '2rem' },
        }}
      >
        All Stories
      </Typography>

      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          mt: { xs: 2, md: 3 },
          px: { xs: 2, sm: 4, md: 0 },
          justifyContent: 'center',
        }}
      >
        {[
          '#92a6ba',
          '#505c68',
          '#505c68',
          '#505c68',
        ].map((bg, i) => (
          <Grid key={i} item xs={6} sm={4} md="auto">
            <Box
              sx={{
                backgroundColor: bg,
                borderRadius: '20px',
                height: { xs: 120, sm: 150, md: 170 },
                width: { xs: '100%', sm: 150, md: 170 },
                mx: 'auto',
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Divider */}
      <Box
        component="hr"
        sx={{
          width: { xs: '80%', md: '50%' },
          borderTop: '1.2px solid black',
          my: { xs: 4, md: 6 },
          mx: 'auto',
        }}
      />

      {/* Unit 1 */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
          ml: { xs: '6vw', md: '10vw' },
          fontSize: { xs: '1.25rem', md: '2rem' },
        }}
      >
        Unit 1
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 4 }}
        sx={{
          mt: { xs: 2, md: 4 },
          px: { xs: 2, sm: 4, md: 0 },
          alignItems: { xs: 'stretch', md: 'flex-start' },
          justifyContent: { md: 'space-around' },
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            backgroundColor: '#92a6ba',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: { xs: 2, md: 3 },
            p: { xs: 2, sm: 3 },
            width: { xs: '100%', md: 500 },
            minHeight: { xs: 200, sm: 220, md: 250 },
            mx: { md: 0 },
          }}
        >
          <Box
            sx={{
              backgroundColor: '#d9d9d9',
              height: { xs: 120, sm: 150, md: 180 },
              width: { xs: 120, sm: 150, md: 180 },
              borderRadius: '30px',
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' } }}
            >
              Momotaro
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              Read about the adventure of Momotaro and his mission to defeat the oni!
            </Typography>
            <Button
              fullWidth
              sx={{
                height: { xs: 40, sm: 44, md: '5vw' },
                maxHeight: 56,
                width: { xs: '100%', sm: 200, md: 180 },
                borderRadius: '30px',
                backgroundColor: '#d3d3d3',
                border: 'none',
                fontWeight: 900,
                mt: 2,
                textTransform: 'none',
                color: '#000',
                '&:hover': { backgroundColor: '#c0c0c0' },
              }}
            >
              Read &gt;
            </Button>
          </Box>
        </Box>

        {/* Right Panel */}
        <Stack spacing={2} sx={{ width: { xs: '100%', md: 350 } }}>
          <Button
            sx={{
              width: '100%',
              height: { xs: 80, sm: 100, md: 110 },
              backgroundColor: '#d3d3d3',
              borderRadius: '20px',
              border: 'none',
              textTransform: 'none',
              color: '#000',
              '&:hover': { backgroundColor: '#c0c0c0' },
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.35rem' } }}
            >
              Review Vocabulary &gt;
            </Typography>
          </Button>

          <Button
            sx={{
              width: '100%',
              height: { xs: 80, sm: 100, md: 110 },
              backgroundColor: '#d3d3d3',
              borderRadius: '20px',
              border: 'none',
              textTransform: 'none',
              color: '#000',
              '&:hover': { backgroundColor: '#c0c0c0' },
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.35rem' } }}
            >
              Learn Grammar &gt;
            </Typography>
          </Button>
        </Stack>
      </Stack>

      {/* Learn Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{
            height: { xs: 56, sm: 64, md: 80 },
            width: { xs: '80%', sm: 260, md: 220 },
            borderRadius: '30px',
            backgroundColor: '#92a6ba',
            border: 'none',
            fontWeight: 900,
            mt: { xs: 4, md: '50px' },
            textTransform: 'none',
            color: '#000',
            '&:hover': { backgroundColor: '#7a92a8' },
          }}
        >
          Learn! &gt;
        </Button>
      </Box>
    </Box>
  );
};

export default Stories;
