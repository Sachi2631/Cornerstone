import React, { useRef, useState, useEffect, CSSProperties, useMemo } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const DEFAULT_SOUND =
  'https://www.myinstants.com/media/sounds/correct.mp3'; // myinstants "Correct Answer GameShow"

const AudioMatch: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(DEFAULT_SOUND);

  // If you later have per-character files, map them here.
  const audioMap: Record<string, string> = useMemo(
    () => ({
      'あ/ア': DEFAULT_SOUND,
      'い/イ': DEFAULT_SOUND,
      'う/ウ': DEFAULT_SOUND,
    }),
    []
  );

  const handleAudioToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayChar = (char: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    const src = audioMap[char] || DEFAULT_SOUND;
    if (audio.src !== src) {
      audio.src = src;
      setCurrentSrc(src);
    }
    audio.currentTime = 0;
    void audio.play();
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    // ensure initial src
    if (!audio.src) audio.src = currentSrc;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [currentSrc]);

  const audioButtonStyle: CSSProperties = {
    ...styles.audioButtonBase,
    backgroundColor: isPlaying ? '#2980b9' : 'white',
    color: isPlaying ? 'white' : 'black',
  };

  return (
    <div style={styles.page}>
      <h2 style={{ marginBottom: '20px' }}>Match the audio to the character</h2>

      <div style={styles.container}>
        {/* Main Play/Pause (controls last selected sound) */}
        <button
          style={audioButtonStyle}
          onClick={handleAudioToggle}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <VolumeUpIcon fontSize="inherit" /> : <PlayArrowIcon fontSize="inherit" />}
        </button>

        {/* Character Buttons (each sets/plays its own sound) */}
        <div style={styles.stackedButtons}>
          {Object.keys(audioMap).map((char) => (
            <button
              key={char}
              style={styles.smallButton}
              onClick={() => handlePlayChar(char)}
              aria-label={`Play ${char}`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Optional: myinstants embed (their hosted button) */}
        <div style={{ marginTop: 20 }}>
          <iframe
            width="110"
            height="200"
            src="https://www.myinstants.com/instant/correct-answer-gameshow/embed/"
            frameBorder={0}
            scrolling="no"
            title="Correct Answer GameShow Sound (myinstants)"
          />
        </div>
      </div>

      {/* Reusable hidden audio element */}
      <audio ref={audioRef} src={currentSrc} preload="auto" />
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
    backgroundColor: '#fff',
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
