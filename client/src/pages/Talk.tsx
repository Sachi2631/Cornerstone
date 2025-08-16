import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Your hamburger menu

const Talk = (): React.ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null); // <-- plain Uint8Array
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // for cleanup

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const lastResult = event.results?.[event.resultIndex];
        if (lastResult?.isFinal) {
          setTranscript((prev) => (prev ? `${prev} ${lastResult[0].transcript}` : lastResult[0].transcript));
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    setTranscript('');
    setIsRecording(true);

    recognitionRef.current?.start();

    // Setup audio + analyser
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const ac = new AudioContext();
    audioContextRef.current = ac;

    const src = ac.createMediaStreamSource(stream);
    sourceRef.current = src;

    const analyser = ac.createAnalyser();
    analyser.fftSize = 2048;
    src.connect(analyser);
    analyserRef.current = analyser;

    // Create the byte buffer (no generics)
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    draw();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();

    // Release mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Close audio context
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;

    analyserRef.current = null;
    sourceRef.current = null;
    dataArrayRef.current = null;
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      if (!isRecording || !analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;

      // If your TS lib complains, keep this cast on this line only:
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current as unknown as Uint8Array);

      const c = canvasRef.current!;
      const g = c.getContext('2d')!;
      g.clearRect(0, 0, c.width, c.height);

      // Fancy gradient stroke
      const gradient = g.createLinearGradient(0, 0, c.width, 0);
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(0.5, '#feca57');
      gradient.addColorStop(1, '#48dbfb');

      g.lineWidth = 4;
      g.strokeStyle = gradient;
      g.shadowBlur = 15;
      g.shadowColor = '#ff6b6b';
      g.beginPath();

      const data = dataArrayRef.current!;
      const sliceWidth = c.width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128.0; // normalize -1..1
        const y = c.height / 2 + v * 100;  // amplify

        i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        x += sliceWidth;
      }

      g.lineTo(c.width, c.height / 2);
      g.stroke();

      if (isRecording) requestAnimationFrame(drawWaveform);
    };

    requestAnimationFrame(drawWaveform);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Menu trigger (positioning handled in component) */}
      <Bart />

      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={3}
        sx={{ backgroundColor: '#dee2e4' }}
      >
        <Typography variant="h3" mb={3}>
          Talk Page
        </Typography>
        <Typography variant="h6" mb={4}>
          Speak and see your words magically appear!
        </Typography>

        {/* Waveform Canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          style={{ backgroundColor: 'white', borderRadius: '8px', marginBottom: '24px' }}
        />

        {/* Start/Stop Button */}
        <Button
          variant="contained"
          color={isRecording ? 'secondary' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          sx={{ mb: 4 }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>

        {/* Transcript */}
        <Box
          bgcolor="#f5f5f5"
          p={3}
          borderRadius={4}
          width="80%"
          minHeight="100px"
          textAlign="left"
          mb={5}
          overflow="auto"
        >
          <Typography variant="body1">
            {transcript || 'Your spoken text will appear here...'}
          </Typography>
        </Box>

        <Button variant="outlined" color="primary" href="/dashboard">
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Talk;
