import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

type CardData = {
  id: number;
  front: string;
  back: string;
  audio?: string;
};

const cards: CardData[] = [
  {
    id: 1,
    front: 'Looks like an apple',
    back: 'あ',
  },
  {
    id: 2,
    front: 'Looks like an ear',
    back: 'い',
  },
  {
    id: 3,
    front: 'Looks like someone being punched',
    back: 'う',
  },
];

const Learn = (): React.ReactElement => {
  const [flipped, setFlipped] = useState<{ [key: number]: boolean }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleFlip = (id: number) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCard = (card: CardData) => (
    <Box
      key={card.id}
      onClick={() => toggleFlip(card.id)}
      sx={{
        perspective: '1000px',
        width: isMobile ? '100%' : 250,
        height: 160,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ccc',
            borderRadius: 3,
            bgcolor: '#fff',
            boxShadow: 3,
            fontSize: '1.2rem',
            fontWeight: '500',
            userSelect: 'none',
          }}
        >
          {card.front}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ccc',
            borderRadius: 3,
            bgcolor: '#fff',
            boxShadow: 3,
            fontSize: '1.2rem',
            fontWeight: '500',
            userSelect: 'none',
            transform: 'rotateY(180deg)',
          }}
        >
          {card.back}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" px={3} py={2}>
  {/* Header */}
  <Box textAlign="center" mb={2} position="relative">
    <Typography variant="h5" fontWeight="bold">Lesson 1</Typography>
    <Button
      variant="contained"
      color="secondary"
      sx={{ position: 'absolute', right: 0, top: 0 }}
    >
      Save + exit
    </Button>
  </Box>

  {/* Cards */}
  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
    {/* Top Card */}
    <Box display="flex" flexDirection="column" alignItems="center">
      {renderCard(cards[0])}
      <IconButton sx={{ mt: 1 }}>
        <VolumeUpIcon color="primary" />
      </IconButton>
    </Box>

    {/* Bottom Cards */}
    <Grid container spacing={2} justifyContent="center">
      {cards.slice(1).map((card) => (
        <Grid item key={card.id}>
          <Box display="flex" flexDirection="column" alignItems="center">
            {renderCard(card)}
            <IconButton sx={{ mt: 1 }}>
              <VolumeUpIcon color="primary" />
            </IconButton>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>

  {/* Next Button */}
  <Box mt={4} textAlign="center">
    <Button
      variant="contained"
      sx={{
        bgcolor: '#e6d6f6',
        color: '#000',
        fontSize: '1.5rem',
        px: 4,
      }}
    >
      →
    </Button>
  </Box>
</Box>

  );  
};

export default Learn;