import React, { useState } from 'react';
import AudioMatch from '../components/AudioMatch';
import Flips from '../components/Flips';
import DragandDrop from '../components/DragDrop';
import MatchDots from '../components/MatchDots';
import Fact from '../components/Fact';
import Reward from '../components/Rewards';
import RInfo from '../components/RewardInfo';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
} from '@mui/material';

const Lesson: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // State to track the current step

  const components = [
    <Flips />,
    <AudioMatch />,
    <DragandDrop />,
    <MatchDots />,
    <Fact />,
    <Reward />,
    <RInfo />,
  ];

  const handleNext = () => {
    if (step < components.length - 1) {
      setStep(step + 1); // Move to the next step
    } else {
      navigate('/dashboard'); // Navigate to the dashboard when all steps are completed
    }
  };

  return (
    <>
    {/* Header */}
    <Box textAlign="center" mb={2} position="relative">
            <Typography variant="h5" fontWeight="bold">Lesson 1</Typography>
            <Button
                variant="contained"
                color="secondary"
                sx={{ position: 'absolute', right: 0, top: 10, }}
                onClick={() => navigate('/dashboard')}
            >
                Save + exit
            </Button>
        </Box>
        <div>
            <AudioMatch />
        </div>

        {/* <div>
            <Flips />
        </div> */}

        {/* <div>
            <DragandDrop />
        </div> */}
        
        {/* <div>
            <MatchDots />
        </div> */}

        {/* <div>
            <Fact />
        </div> */}

    {/* Next Button */}
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          sx={{
            bgcolor: '#e6d6f6',
            color: '#000',
            fontSize: '1.5rem',
            px: 4,
            marginBottom: 4,
          }}
          onClick={handleNext}
        >
          →
        </Button>
      </Box>
    </>
  );
};

export default Lesson;