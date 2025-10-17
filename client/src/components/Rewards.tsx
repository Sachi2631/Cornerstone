import React from 'react';

interface RewardProps {
  title: string;
  xp: number | string;
}


const Reward: React.FC <RewardProps> = ({title, xp}) => {
  return (
    <div style={styles.body}>
      <h2>Complete!</h2>
      <h1>You earned:</h1>
      <h2>Aritaware</h2>
      <div style={styles.img}></div>
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
};

export default Reward;
