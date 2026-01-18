import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HEADER_HEIGHT = 73; // ← match your Header/AppBar height (56 mobile, 64/72 desktop)

const columnsData: string[][] = [
  ['Stories', 'Gallery', 'Resources', 'Talk'],
  ['Fun Facts', 'Games', 'Watch']
];

const menuImages: Record<string, string> = {
  Stories: 'assets/Stories.png',
  Gallery: 'assets/Gallery.png',
  Resources: 'assets/Resources.png',
  Talk: 'assets/Talk.png',
  'Fun Facts': 'assets/Fun Facts.png',
  Games: 'assets/Games.png',
  Watch: 'assets/Watch.png',
};


const styles = {
  container: {
    position: 'relative' as const,
    zIndex: 10,
  },
  open: {
    position: 'fixed' as const,
    top: `${HEADER_HEIGHT + 40}px`, // keep opener below header
    left: '30px',
    minWidth: '60px',   // wider, horizontal button
    height: '50px',
    cursor: 'pointer',
    zIndex: 100000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px', // soft rectangle
    padding: '0 10px',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
  },
  close: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '8px',
  },
  menu: {
    backgroundColor: '#92a6ba',
    display: 'flex',
    flexDirection: 'row' as const,
    width: '290px',
    height: `calc(100vh - ${HEADER_HEIGHT}px)`,
    transition: 'transform 0.3s ease',
    position: 'fixed' as const,
    top: `${HEADER_HEIGHT}px`,
    left: 0,
    zIndex: 999,
    paddingTop: '60px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
    overflowY: 'auto' as const,
  },
  menuHidden: {
    transform: 'translateX(-100%)',
  },
  column: {
    width: '135px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
  },
  box: {
    marginTop: '5px',
    marginLeft: '20px',
    textAlign: 'center' as const,
  },
  img: {
    backgroundColor: '#d9d9d9',
    height: '14vh',
     width: '100%',
    borderRadius: '10px',
    marginBottom: '5px',
    padding: '5px',
    objectFit: 'cover',
  },
};

const Bart: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.container}>
      {!open && (
        <div style={styles.open} onClick={() => setOpen(true)}>
          <img
            src="https://www.svgrepo.com/show/344422/arrow-right-short.svg"
            alt="Open Menu"
            style={{ width: '30px', height: '30px' }}
          />
        </div>
      )}

      <div style={{ ...styles.menu, ...(open ? {} : styles.menuHidden) }}>
        <div style={styles.close} onClick={() => setOpen(false)}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/109/109618.png"
            alt="Close"
            style={{ width: '30px', height: '30px' }}
          />
        </div>

        {columnsData.map((columnItems, colIndex) => (
          <div style={styles.column} key={colIndex}>
            {columnItems.map((title, itemIndex) => {
              const boxContent = (
                <div style={styles.box} key={itemIndex}>
                  <img
                    src={menuImages[title]}
                    alt={title}
                    style={{...styles.img, objectFit: 'cover' }}
                  />
                  <h4>{title}</h4>
                </div>
              );

              if (title === 'Fun Facts') {
                return (
                  <Link to="/funfacts" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Resources') {
                return (
                  <Link to="/resources" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Stories') {
                return (
                  <Link to="/stories" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Gallery') {
                return (
                  <Link to="/gallery" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Games') {
                return (
                  <Link to="/games" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Watch') {
                return (
                  <Link to="/watch" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }
              if (title === 'Talk') {
                return (
                  <Link to="/talk" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {boxContent}
                  </Link>
                );
              }

              return boxContent;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bart;
