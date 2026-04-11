import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut';

const Talk = (): React.ReactElement => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // FIX (TS): explicitly typed as Uint8Array<ArrayBuffer> — TypeScript 5.x tightened
  // Uint8Array to be generic. Uint8Array<ArrayBufferLike> (which includes SharedArrayBuffer)
  // is no longer assignable to the ArrayBuffer-only overload of getByteTimeDomainData.
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // FIX (stale closure): isRecording is React state — its value is captured at the time
  // draw() is called, which is before setIsRecording(true) has taken effect.
  // The animation loop saw isRecording=false and immediately bailed every time.
  // A ref is set synchronously so the loop always sees the current value.
  const isRecordingRef = useRef(false);

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
          setTranscript((prev) =>
            prev ? `${prev} ${lastResult[0].transcript}` : lastResult[0].transcript
          );
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = async () => {
    setTranscript('');

    // FIX: set ref synchronously BEFORE calling draw() so the loop sees true immediately
    isRecordingRef.current = true;
    setIsRecording(true);

    recognitionRef.current?.start();

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

    // FIX (TS): cast to Uint8Array<ArrayBuffer> so it matches the ref type and
    // satisfies getByteTimeDomainData's parameter type without a workaround cast.
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

    draw();
  };

  const stopRecording = () => {
    // FIX: clear ref synchronously so the animation loop stops on the next frame
    isRecordingRef.current = false;
    setIsRecording(false);

    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
    dataArrayRef.current = null;
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const drawWaveform = () => {
      // FIX: check isRecordingRef.current (always current), not isRecording (stale closure)
      if (
        !isRecordingRef.current ||
        !analyserRef.current ||
        !dataArrayRef.current ||
        !canvasRef.current
      ) return;

      // FIX (TS): no cast needed here anymore — types match cleanly
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      const c = canvasRef.current;
      const g = c.getContext('2d');
      if (!g) return;

      g.clearRect(0, 0, c.width, c.height);

      const gradient = g.createLinearGradient(0, 0, c.width, 0);
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(0.5, '#feca57');
      gradient.addColorStop(1, '#48dbfb');

      g.lineWidth = 4;
      g.strokeStyle = gradient;
      g.shadowBlur = 15;
      g.shadowColor = '#ff6b6b';
      g.beginPath();

      const data = dataArrayRef.current;
      const sliceWidth = c.width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128.0;
        const y = c.height / 2 + v * 80;
        i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        x += sliceWidth;
      }

      g.lineTo(c.width, c.height / 2);
      g.stroke();

      // FIX: loop continues only while ref is true
      if (isRecordingRef.current) requestAnimationFrame(drawWaveform);
    };

    requestAnimationFrame(drawWaveform);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
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

        {/* FIX (responsive): was fixed width={600} which overflows on mobile.
            Canvas keeps its 600-wide intrinsic resolution for quality but
            scales down via CSS width:100% inside a maxWidth:600 container. */}
        <Box sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={100}
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'block',
            }}
          />
        </Box>

        <Button
          variant="contained"
          color={isRecording ? 'secondary' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          sx={{ mb: 4 }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>

        <Box
          bgcolor="#f5f5f5"
          p={3}
          borderRadius={4}
          width={{ xs: '95%', sm: '80%' }}
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