import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const Talk = (): React.ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
          setTranscript((prev) => prev + ' ' + lastResult[0].transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    setTranscript('');
    setIsRecording(true);

    recognitionRef.current?.start();

    // Setup waveform
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new AudioContext();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    draw();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();

    audioContextRef.current?.close();
    analyserRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;
    
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);
    
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
    
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Create Gradient (left to right)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#ff6b6b');    // Start color (red-ish)
      gradient.addColorStop(0.5, '#feca57');  // Middle color (yellow/orange)
      gradient.addColorStop(1, '#48dbfb');    // End color (blue)
    
      ctx.lineWidth = 4;
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff6b6b';  // Glow color
    
      ctx.beginPath();
    
      const sliceWidth = (canvas.width * 1.0) / dataArrayRef.current.length;
      let x = 0;
    
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const v = (dataArrayRef.current[i] - 128) / 128.0; // Normalize between -1 and 1
        const amplified = v * 100; // Amplify
        const y = canvas.height / 2 + amplified;
    
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
    
        x += sliceWidth;
      }
    
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    
      if (isRecording) {
        requestAnimationFrame(drawWaveform);
      }
    };
  
    requestAnimationFrame(drawWaveform);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={3}
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

        {/* Auto-generated Text */}
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

        {/* Back Button */}
        <Button
          variant="outlined"
          color="primary"
          href="/dashboard"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Talk;