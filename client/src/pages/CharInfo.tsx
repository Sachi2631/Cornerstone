import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Bart from '../components/Menut';
import { getCharacterById } from '../data/characters';

const CharInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const char = id ? getCharacterById(id) : undefined;

  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100vh',
      padding: '20px 12px',
      margin: 0,
      fontFamily: 'sans-serif',
      position: 'relative' as const,
    },
    main: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      gap: '24px',
      marginTop: '20px',
      flexWrap: 'wrap' as const,
    },
    img: {
      height: '48vh',
      maxHeight: 420,
      width: 280,
      backgroundColor: '#d3d3d3',
      borderRadius: '30px',
    },
    caption: {
      textAlign: 'left' as const,
      padding: '20px',
      width: 'min(680px, 90vw)',
      background: '#f5f5f5',
      borderRadius: '16px',
    },
    p: {
      fontSize: '16px',
      lineHeight: 1.5,
      margin: 0,
    },
    backWrap: { marginTop: 20, textAlign: 'center' as const },
  };

  if (!char) {
    return (
      <div style={styles.body}>
        <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <Bart />
        </Box>
        <h2>Character not found</h2>
        <Button variant="outlined" component={RouterLink} to="/gallery">
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div style={styles.body}>
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <h2>Gallery</h2>
      <div style={styles.main}>
        <div>
          <div style={styles.img}></div>
          <p style={styles.p}>Met: {char.met}</p>
        </div>
        <div style={styles.caption}>
          <h3 id="name" style={{ marginTop: 0 }}>{char.name}</h3>
          <p id="info" style={styles.p}>{char.description}</p>

          <h3 style={{ marginTop: 16 }}>Abilities:</h3>
          {char.abilities.map((ab, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <h4 style={{ margin: '4px 0' }}>{ab.name}</h4>
              <p style={styles.p}>{ab.effect}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.backWrap}>
        <Button variant="contained" component={RouterLink} to="/gallery">
          Back to Gallery
        </Button>
      </div>
    </div>
  );
};

export default CharInfo;
