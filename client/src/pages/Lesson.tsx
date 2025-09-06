import AudioMatch from '../components/AudioMatch';
import Flips from '../components/Flips';
import DragandDrop from '../components/DragDrop';
import MatchDots from '../components/MatchDots';
import Fact from '../components/Fact';
import { useNavigate } from 'react-router-dom';


import {
    Box,
    Typography,
    Button,
    Grid,
    IconButton,
    useTheme,
    useMediaQuery,
  } from '@mui/material';


const Lesson: React.FC = () => {
    const navigate = useNavigate();
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
        {/* <div>
            <AudioMatch />
        </div> */}

        {/* <div>
            <Flips />
        </div> */}

        {/* <div>
            <DragandDrop />
        </div> */}
        
        {/* <div>
            <MatchDots />
        </div> */}

        <div>
            <Fact />
        </div>

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
        >
          →
        </Button>
    </Box>
    </>
);
};


export default Lesson;