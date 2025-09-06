import React from 'react';
import { Box, Typography } from '@mui/material';

const Fact: React.FC = () => {
  return (
    <div style={styles.body}>
      <div style={styles.box}>
        <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '25px', }}>Hiragana is used for Japanese-origin words!</Typography>
        <Typography variant="subtitle1" sx={{ textAlign: 'left', fontSize: '25px', }}>Katakana is used for loan-words from other languages!</Typography>
      </div>

      <img
        src="https://www.freeiconspng.com/thumbs/cat-icon/cat-icon-25.png"
        alt="Cat Icon"
        style={styles.img}
      />
    </div>
  );
};

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
    marginTop: '10vh',
    paddingLeft: '20px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  img: {
    height: '30vh',
  },
};

export default Fact;
