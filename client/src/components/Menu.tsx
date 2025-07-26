import React, { useState } from 'react';

const columnsData: string[][] = [
  ['Stories', 'Gallery', 'Resources', 'Talk'],
  ['Fun Facts', 'Games', 'Watch']
];

const styles = {
  container: {
    position: 'relative' as const,
  },
  open: {
    position: 'absolute' as const,
    top: '15px',
    left: '-49vw',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: 'orange',
  },
  close: {
    position: 'absolute' as const,
    top: '20px',
    left: '-30vw',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundColor: 'red',
  },
  barLine: {
    width: '100%',
    height: '4px',
    backgroundColor: '#333',
    borderRadius: '2px',
  },
  menu: {
    backgroundColor: '#92a6ba',
    display: 'flex',
    flexDirection: 'row' as const,
    width: '290px',
    height: '100vh',
    transition: 'transform 0.3s ease',
    position: 'fixed' as const,
    top: 70,
    left: 0,
    zIndex: 2,
    paddingTop: '10px',
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
    marginRight: '5px',
  }
};

const Bar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.container}>
      {/* Hamburger icon */}
      <div style={styles.open} onClick={() => setOpen(!open)}>
        {/* <div style={styles.barLine}></div>
        <div style={styles.barLine}></div>
        <div style={styles.barLine}></div> */}
        <img
          src="https://www.svgrepo.com/show/344422/arrow-right-short.svg"
          alt="Open menu icon"
        />
      </div>

      {/* Slide-out menu */}
      <div style={{ ...styles.menu, ...(open ? {} : styles.menuHidden) }}>
        {columnsData.map((columnItems, colIndex) => (
          <div style={styles.column} key={colIndex}>
            {columnItems.map((title, itemIndex) => (
              <div style={styles.box} key={itemIndex}>
                <div style={styles.img}></div>
                <h4>{title}</h4>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bar;
