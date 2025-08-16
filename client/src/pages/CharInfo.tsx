import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut';


const CharInfo: React.FC = () => {
  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100vh',
      padding: '20px',
      margin: 0,
      fontFamily: 'sans-serif',
    },
    main: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      marginTop: '20px',
    },
    img: {
      height: '50vh',
      width: '250px',
      backgroundColor: '#d3d3d3',
      borderRadius: '30px',
    },
    char: {
      marginRight: '30px',
    },
    caption: {
      textAlign: 'left' as const,
      padding: '20px',
      width: '30vw',
    },
    p: {
      fontSize: '16px',
    },
  };

  return (

    
    <div style={styles.body}>

    <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
            <Bart />
        </Box>


      <h2>Gallery</h2>
      <div style={styles.main}>
        <div style={styles.char}>
          <div style={styles.img}></div>
          <p style={styles.p}>Met: 08/29/20</p>
        </div>
        <div style={styles.caption}>
          <h3 id="name">Momotaro</h3>
          <p id="info" style={styles.p}>
            A young boy born from a peach, he defeats the oni on the island of Onigashima with his
            friends, the dog, the pheasant, and the monkey.
          </p>
          <h3>Abilities:</h3>
          <h4>Kibidango</h4>
          <p style={styles.p}>(+2 damage per correct answer)</p>
        </div>
      </div>

    <a href="gallery">
      <button> Gallery </button>
    </a>
    </div>
  );
};

export default CharInfo;
