import React from 'react';

const RInfo: React.FC = () => {
  return (
    <div style={styles.body}>
      <div style={styles.img}></div>
      <h3 style={styles.text}>
        Oh wow! This vase is very special! It’s a porcelain vase with blue-and-white patterns called “sometsuke.” It’s called “Aritaware” from Saga Prefecture!
      </h3>
    </div>
  );
};

const styles = {
  body: {
    textAlign: 'center' as const,
  },
  img: {
    height: '50vh',
    backgroundColor: 'pink',
    width: '60vw',
    marginLeft: '20vw',
    borderRadius: '12px',
  },
  text: {
    marginLeft: '15vw',
    marginRight: '15vw',
    marginTop: '6vh',
  },
};

export default RInfo;
