import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut';

const FunFacts = (): React.ReactElement => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catBtnRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      catBtnRef.current &&
      !catBtnRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const styles = {
    main: {
      backgroundColor: '#b4441d',
      padding: '40px',
      width: '70vw',
      marginLeft: '15vw',
      marginTop: '80px',
      borderRadius: '25px',
      color: '#fff',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    },
    h3: {
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    learnMoreBtn: {
      marginTop: '15px',
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      color: '#b4441d',
      fontWeight: 600,
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    hr: {
      height: '1px',
      border: 'none',
      borderTop: '1px solid #333',
      margin: '40px auto',
      width: '70vw',
    },
    but: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '40px',
    },
    divider: {
      width: '1px',
      height: '35px',
      backgroundColor: '#333',
    },
    button: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'absolute' as const,
      backgroundColor: '#fff',
      minWidth: '160px',
      boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
      zIndex: 1,
      marginTop: '45px',
      right: 0,
      borderRadius: '8px',
    },
    dropdownItem: {
      color: 'black',
      padding: '10px 14px',
      textDecoration: 'none',
      display: 'block',
      cursor: 'pointer',
    },
    scroll: {
      display: 'flex',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap' as const,
      gap: '20px',
      padding: '0 40px',
    },
    column: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    facts: {
      width: '260px',
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      color: '#000',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
    },
  };

  return (
    <Box sx={{
      backgroundColor: '#dee2e4',
      minHeight: '100vh',
      paddingBottom: '50px',
      position: 'relative',
      paddingTop: '5px'
    }}>
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <Box sx={styles.main}>
        <Typography variant="h3" sx={styles.h3}>Fun Fact of the Day:</Typography>
        <Typography variant="body1">
          During Japan’s self-isolation period (sakoku), there was an island called Dejima in Nagasaki prefecture that was open to Dutch trade. The Dutch were Japan’s only main trading partners because they weren’t focused on spreading Christianity. So, the Nagasaki area has a lot of European influence!
        </Typography>
        <a href="#" style={styles.learnMoreBtn}>Learn more</a>
      </Box>

      <hr style={styles.hr} />

      <Box sx={styles.but}>
        <button style={styles.button}>All</button>
        <div style={styles.divider}></div>
        <Box sx={{ position: 'relative' }}>
          <button style={styles.button} onClick={toggleDropdown} ref={catBtnRef}>
            Categories <span style={{ marginLeft: '4px' }}>▼</span>
          </button>
          {dropdownOpen && (
            <div style={styles.dropdown} ref={dropdownRef}>
              {['History', 'Food', 'Places', 'Urban Legends', 'Culture', 'Random'].map((item) => (
                <a key={item} href="#" style={styles.dropdownItem}>{item}</a>
              ))}
            </div>
          )}
        </Box>
      </Box>

      <Box sx={styles.scroll}>
        {[
          [
            { title: 'Places Fact #1', text: 'Japan has a rabbit island called Ookunoshima, near Hiroshima.' },
            { title: 'Places Fact #2', text: 'Tokyo is the "east capital", east of Kyoto.' },
          ],
          [
            { title: 'Culture Fact #1', text: 'Dorodango means shiny mud ball in Japanese!' },
            { title: 'Culture Fact #2', text: 'Many celebrate holidays across multiple religions in Japan.' },
          ],
          [
            { title: 'History Fact #1', text: 'Kongo-gumi is the world\'s oldest company, founded in Japan.' },
            { title: 'History Fact #2', text: 'Nagasaki kept trading with the Dutch during isolation.' },
          ]
        ].map((column, i) => (
          <Box key={i} sx={styles.column}>
            {column.map((fact, j) => (
              <Box key={j} sx={styles.facts}>
                <Typography variant="h6" gutterBottom>{fact.title}</Typography>
                <Typography variant="body2">{fact.text}</Typography>
                <a href="#" style={styles.learnMoreBtn}>Learn more</a>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FunFacts;
