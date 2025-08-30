import React, { useRef, useState, useEffect, CSSProperties } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';


const AudioMatch: React.FC = () => {
const audioRef = useRef<HTMLAudioElement>(null);
const [isPlaying, setIsPlaying] = useState(false);


const handleAudioToggle = () => {
const audio = audioRef.current;
if (!audio) return;


if (audio.paused) {
  audio.play();
  setIsPlaying(true);
} else {
  audio.pause();
  setIsPlaying(false);
}

};


useEffect(() => {
const audio = audioRef.current;
if (!audio) return;


const handleEnded = () => setIsPlaying(false);
audio.addEventListener('ended', handleEnded);

return () => {
  audio.removeEventListener('ended', handleEnded);
};

}, []);


const audioButtonStyle: CSSProperties = {
...styles.audioButtonBase,
backgroundColor: isPlaying ? '#2980b9' : 'white',
color: isPlaying ? 'white' : 'black',
};


return (
<div style={styles.page}>
<h2 style={{ marginBottom: '20px' }}>Match the audio to the character</h2>


  <div style={styles.container}>
    <button
      style={audioButtonStyle}
      onClick={handleAudioToggle}
      aria-label="Play Audio"
    >
      {isPlaying ? <VolumeUpIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
    </button>

    <div style={styles.stackedButtons}>
      <button style={styles.smallButton}>
        あ/ア
      </button>
      <button style={styles.smallButton}>
        い/イ
      </button>
      <button style={styles.smallButton}>
        う/ウ
      </button>
    </div>
  </div>

  <audio ref={audioRef} src="/your-audio-file.mp3" />
</div>

);
};


const styles = {
page: {
margin: 0,
padding: 0,
minHeight: '100vh',
display: 'flex',
flexDirection: 'column' as const,
justifyContent: 'center',
alignItems: 'center',
fontFamily: 'Arial, sans-serif',
backgroundColor: '#f0f0f0',
},
container: {
display: 'flex',
flexDirection: 'column' as const,
alignItems: 'center',
gap: '20px',
},
audioButtonBase: {
width: '200px',
height: '200px',
border: '4px solid #ccc',
fontSize: '4rem',
borderRadius: '6px',
cursor: 'pointer',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
transition: 'background-color 0.3s, color 0.3s',
userSelect: 'none',
} as CSSProperties,
stackedButtons: {
display: 'flex',
flexDirection: 'column' as const,
gap: '15px',
width: '200px',
},
smallButton: {
padding: '12px',
fontSize: '1rem',
border: '4px solid #ccc',
borderRadius: '6px',
backgroundColor: 'white',
cursor: 'pointer',
transition: 'background-color 0.3s, color 0.3s',
userSelect: 'none',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
} as CSSProperties,
};


export default AudioMatch;