import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Bart from '../components/Menut';
import { CHARACTERS } from '../data/characters';

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'characters' | 'items'>('characters');

  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100dvh',
      paddingBottom: '50px',
      position: 'relative' as const,
      margin: 0,
      paddingLeft: 8,
      paddingRight: 8,
    },
    topRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      gap: '48px',
      marginTop: '20px',
      flexWrap: 'wrap' as const,
    },
    divider: {
      width: '1px',
      height: '28px',
      backgroundColor: '#333',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '18px',
      maxWidth: 800,
      margin: '24px auto 0',
      padding: '0 8px',
    },
    card: {
      width: '100%',
      aspectRatio: '1 / 1',
      backgroundColor: '#989291',
      borderRadius: '17px',
    } as React.CSSProperties,
    cardWrap: { textDecoration: 'none', color: 'inherit' },
    part: { width: '100%' },
    title: { marginTop: 8 },
    tabBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
    },
    tabBtnActive: {
      textDecoration: 'underline',
      fontWeight: 600,
    },
  };

  return (
    <Box sx={styles.body}>
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <h1 style={{ margin: 0, paddingTop: 30, paddingBottom: 10 }}>Gallery</h1>

      <div style={styles.topRow}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'characters' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>

        <div style={styles.divider} />

        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'items' ? styles.tabBtnActive : {}) }}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
      </div>

      {activeTab === 'characters' && (
        <div style={styles.grid}>
          {CHARACTERS.map((c) => (
            <Link
              key={c.id}
              to={`/characters/${c.id}`}
              style={styles.cardWrap}
            >
              <div style={styles.part}>
                <div style={styles.card} />
                <h3 style={styles.title}>{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'items' && (
        <div style={styles.grid}>
          {/* Dummy items for now */}
          {['Simple Katana', 'Mystic Fan', 'Lucky Charm', 'Onigiri'].map((name, i) => (
            <div key={i} style={styles.part}>
              <div style={styles.card} />
              <h3 style={styles.title}>{name}</h3>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default Gallery;
