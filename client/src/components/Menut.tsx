import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ import Link

const columnsData: string[][] = [
  ['Stories', 'Gallery', 'Resources', 'Talk'],
  ['Fun Facts', 'Games', 'Watch']
];

const styles = {
  container: {
    position: 'relative' as const,
    zIndex: 10,
  },
  open: {
    position: 'fixed' as const,
    top: '100px',
    left: '30px',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    zIndex: 100000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
  },
  close: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
  },
  menu: {
    backgroundColor: '#92a6ba',
    display: 'flex',
    flexDirection: 'row' as const,
    width: '290px',
    height: '100vh',
    transition: 'transform 0.3s ease',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 999,
    paddingTop: '60px',
    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
    overflowY: 'auto' as const
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
    marginTop: '10px',
    marginLeft: '20px',
    textAlign: 'center' as const,
  },
  img: {
    backgroundColor: '#d9d9d9',
    height: '14vh',
    borderRadius: '10px',
    marginBottom: '5px',
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
                  <div style={styles.img}></div>
                  <h4>{title}</h4>
                </div>
              );

              // Only "Fun Facts" is wrapped with <Link>
              if (title === 'Fun Facts') {
                return (
                  <Link to="/funfacts" key={itemIndex} style={{ textDecoration: 'none', color: 'inherit' }}>
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
