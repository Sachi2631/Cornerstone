import React, { useState } from 'react';
import { Box } from '@mui/material';
import Bart from '../components/Menut';

const Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'characters' | 'items'>('characters');

  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100dvh',          // better on mobile than 100vh
      paddingBottom: '50px',
      position: 'relative' as const,
      margin: 0,                    // ensure no outer margin
    },
    topRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      gap: '100px',
      marginTop: '20px',            // was 40px; reduce to something intentional
    },
    divider: {
      width: '1px',
      height: '35px',
      backgroundColor: '#333',
    },
    row: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-around',
      margin: 'auto',
      width: '600px',
      padding: '30px',
    },
    part: {
      width: '200px',
      marginTop: '10px',
    },
    box: {
      height: '30vh',
      backgroundColor: '#989291',
      borderRadius: '17px',
    },
    tabBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
    },
    tabBtnActive: {
      textDecoration: 'underline',
    },
  };

  return (
    <Box sx={styles.body}>
      {/* place menu button */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      {/* Kill default h1 margin; add our own spacing */}
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
        <div id="char">
          <div style={styles.row as any}>
            <GalleryCard title="Momotaro" />
            <GalleryCard title="???" />
          </div>
          <div style={styles.row as any}>
            <GalleryCard title="???" />
            <GalleryCard title="???" />
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div id="itemsContent">
          <div style={styles.row as any}>
            <GalleryCard title="Simple Katana" />
            <GalleryCard title="???" />
          </div>
          <div style={styles.row as any}>
            <GalleryCard title="???" />
            <GalleryCard title="???" />
          </div>
        </div>
      )}
    </Box>
  );
};

interface GalleryCardProps {
  title: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ title }) => (
  <div style={{ width: 200, marginTop: 10 }}>
    <div style={{ height: '30vh', backgroundColor: '#989291', borderRadius: 17 }} />
    <h3 style={{ marginTop: 8 }}>{title}</h3>
  </div>
);

export default Gallery;
