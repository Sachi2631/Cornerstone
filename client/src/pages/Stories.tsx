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
                  height: { xs: 140, sm: 160, md: 180 },
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
                >
                  {bg === '#505c68' && (
                    <Box
                      component="img"
                      src="assets/Lock.png"
                      alt="Locked"
                      sx={{
                        width: '45%',
                        maxWidth: 100,
                        opacity: 0.9,
                        
                      }}
                    />
                  )}
                </CardActionArea>
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
          UNIT 1: MOMOTARO
        </Typography>

<Stack
  direction={{ xs: 'column', md: 'row' }}
  spacing={4}
  sx={{ alignItems: 'stretch' }}
>
  {/* LEFT STORY CARD */}
  <Box
    sx={{
      flex: 1,
      backgroundColor: '#9fb1c4',
      borderRadius: '28px',
      width: '20vw',
      p: 3,
      display: 'flex',
      gap: 3,
      alignItems: 'center',
    }}
  >
    {/* Peach image placeholder */}
    <Box
      sx={{
        width: 160,
        height: 160,
        borderRadius: '20px',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        color: '#777',
        flexShrink: 0,
      }}
    >
      <img src="assets/Peach.png" alt="Momotaro" style={{ height: "80px" }} />
    </Box>

    {/* Text */}
    <Box sx={{ flex: 1 }}>
      <Typography variant="h4" sx={{ fontSize: '1.25rem', fontWeight: 800 }}>
        Momotaro
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, color: '#1e1e1e' }}>
        Read about the adventure of Momotaro and his mission to defeat the oni!
      </Typography>
      <Button
      sx={{
        alignSelf: 'flex-end',
        mt: 1,
        px: 4,
        height: "60px",
        width: "14vw",
        borderRadius: '999px',
        backgroundColor: '#d3d3d3',
        fontSize: '1.4rem',
        fontWeight: 400,
        textTransform: 'none',
        color: '#1e1e1e',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "30px",
      }}
    >
      Read!

      <img src="assets/Blue Arrow.png" alt="arrow" style={{ height: "30px" }} />
    </Button>
    </Box>
  </Box>

  <Stack spacing={3} sx={{ width: { xs: '100%', md: 360 } }}>
    <Box
      sx={{
        backgroundColor: '#e1e1e1',
        borderRadius: '22px',
        p: 2.5,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>
          Review Vocabulary
        </Typography>
        
      </Stack>

      {/* Progress */}
      <Box sx={{ mt: 1.5 }}>
        <Box
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: '#cfcfcf',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: '0%', height: '100%', backgroundColor: '#7aa0c4' }} />
        </Box>
        <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>0%</Typography>
      </Box>

      <img src="assets/Blue Arrow.png" alt="Momotaro" style={{ height: "30px" }} />

    </Box>

    <Box
      sx={{
        backgroundColor: '#e1e1e1',
        borderRadius: '22px',
        p: 2.5,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800 }}>
          Learn Grammar
        </Typography>
        <img src="assets/Blue Arrow.png" alt="Momotaro" style={{ height: "30px" }} />
      </Stack>

      {/* Progress */}
      <Box sx={{ mt: 1.5 }}>
        <Box
          sx={{
            height: 6,
            borderRadius: 999,
            backgroundColor: '#cfcfcf',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: '0%', height: '100%', backgroundColor: '#7aa0c4' }} />
        </Box>
        <Typography sx={{ fontSize: '0.75rem', mt: 0.5 }}>0%</Typography>
      </Box>
    </Box>

    {/* LEARN BUTTON */}
    <Button
      sx={{
        alignSelf: 'flex-end',
        mt: 1,
        px: 4,
        height: "60px",
        width: "15vw",
        borderRadius: '999px',
        backgroundColor: '#92a6ba',
        fontSize: '1.4rem',
        fontWeight: 400,
        textTransform: 'none',
        color: '#1e1e1e',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        '&:hover': { backgroundColor: '#8da3b8' },
      }}
    >
      Learn!

      <img src="assets/Arrow.png" alt="arrow" style={{ height: "30px" }} />
    </Button>
  </Stack>
</Stack>

      </Container>
    </Box>
  );
};

export default Stories;
