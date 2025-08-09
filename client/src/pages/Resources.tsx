import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Your hamburger menu

const Resources = (): React.ReactElement => {
  const categories = {
    News: ['NHK', 'Ohayo Nihon', 'Asahi', 'NHK News Web Easy', 'Places'],
    Textbooks: ['Genki', 'Japanese for Busy People', 'Random'],
    Videos: ['NHK for School', 'Youtube channel', 'Doraemon', 'Some youtube'],
    Shows: ['Some anime', 'Gegege no Kitaro', 'Doraemon', 'Some youtube'],
    Organizations: ['Japan Society of Northern California', 'Culture', 'Random'],
    Writing: ['Exercise sheets', 'More practice', 'Exercise 3'],
    Podcasts: ['Example 1', 'Example 2', 'Example 3'],
    Reading: ['Ame nimo makezu', 'Book 2', 'Poem 3'],
  };

  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100vh',
      paddingBottom: '50px',
    },
    menu: {
      display: 'flex',
      flexDirection: 'column' as const,
      marginTop: '50px',
    },
    row: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    box: {
      height: '15vw',
      width: '250px',
      borderRadius: '7px',
      backgroundColor: '#989191',
      marginTop: '20px',
      margin: '30px',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
    },
  };

  return (
    <Box sx={styles.body}>

    <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>
      <Typography variant="h3" sx={{ paddingTop: '30px' }}>Resources</Typography>

      <Box sx={styles.menu}>
        {Object.entries(categories).map(([section, items]) => (
          <React.Fragment key={section}>
            <Typography variant="h5" sx={{ marginTop: '40px' }}>{section}</Typography>
            <Box sx={styles.row}>
              {items.map((item, idx) => (
                <Button key={idx} sx={styles.box}>
                  {item}
                </Button>
              ))}
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Resources;
