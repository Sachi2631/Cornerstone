// src/components/Fact.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

interface FactProps {
  title: string;
  description: string;
}

const Fact: React.FC<FactProps> = ({ title, description }) => {
  return (
    <div style={styles.body}>
      <div style={styles.box}>
        <Typography variant="h5" sx={{ textAlign: 'left', fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '20px', mt: 2 }}>{description}</Typography>
      </div>
            
      <img
        src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png" // This is a generic cat icon, consider finding one that fits the theme.
        alt="Cat Icon"
        style={styles.img}
      />
    </div>
  );
};

// ... (your styles object remains the same)

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#d9d9d9',
    borderColor: '#505c68',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '12px',
    height: '250px',
    width: '40vw',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  img: {
    height: '30vh',
    marginTop: '20px',
  },
};

export default Fact;