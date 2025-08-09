import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Bart from '../components/Menut'; // ✅ Your hamburger menu

const Stories = (): React.ReactElement => {
  return (
    <Box
      sx={{
        textAlign: 'right',
        backgroundColor: '#dee2e4',
        minHeight: '100vh',
        paddingBottom: '50px',
        paddingTop: '20px',
      }}
    >

<Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>
      {/* Header */}
      <Typography variant="h2" sx={{ textAlign: 'center', mb: 4 }}>
        Stories
      </Typography>

      {/* All Stories Section */}
      <Typography variant="h4" sx={{ textAlign: 'left', marginLeft: '10vw' }}>
        All Stories
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
        <Box sx={{ backgroundColor: '#92a6ba', borderRadius: '20px', height: '170px', width: '170px', margin: '20px' }} />
        <Box sx={{ backgroundColor: '#505c68', borderRadius: '20px', height: '170px', width: '170px', margin: '20px' }} />
        <Box sx={{ backgroundColor: '#505c68', borderRadius: '20px', height: '170px', width: '170px', margin: '20px' }} />
        <Box sx={{ backgroundColor: '#505c68', borderRadius: '20px', height: '170px', width: '170px', margin: '20px' }} />
      </Box>

      {/* Divider */}
      <Box
        component="hr"
        sx={{
          width: '50%',
          borderTop: '1.2px solid black',
          margin: '40px auto',
        }}
      />

      {/* Unit 1 Section */}
      <Typography variant="h4" sx={{ textAlign: 'left', marginLeft: '10vw' }}>
        Unit 1
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'row',
          textAlign: 'left',
          mt: 4,
        }}
      >
        {/* Left Panel */}
        <Box
          sx={{
            height: '250px',
            width: '500px',
            backgroundColor: '#92a6ba',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#d9d9d9',
              height: '180px',
              width: '180px',
              borderRadius: '30px',
              margin: '10px',
            }}
          />
          <Box sx={{ width: '180px', margin: '15px' }}>
            <Typography variant="h5">Momotaro</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Read about the adventure of Momotaro and his mission to defeat the oni!
            </Typography>
            <Button
              sx={{
                height: '5vw',
                width: '180px',
                borderRadius: '30px',
                backgroundColor: '#d3d3d3',
                border: 'none',
                fontWeight: 900,
                mt: 2,
                textTransform: 'none',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#c0c0c0',
                },
              }}
            >
              Read &gt;
            </Button>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Button
            sx={{
              width: '350px',
              height: '110px',
              backgroundColor: '#d3d3d3',
              borderRadius: '20px',
              border: 'none',
              textTransform: 'none',
              color: '#000',
              '&:hover': {
                backgroundColor: '#c0c0c0',
              },
            }}
          >
            <Typography variant="h5">Review Vocabulary &gt;</Typography>
          </Button>

          <Button
            sx={{
              width: '350px',
              height: '110px',
              backgroundColor: '#d3d3d3',
              borderRadius: '20px',
              border: 'none',
              textTransform: 'none',
              color: '#000',
              mt: 3,
              '&:hover': {
                backgroundColor: '#c0c0c0',
              },
            }}
          >
            <Typography variant="h5">Learn Grammar &gt;</Typography>
          </Button>
        </Box>
      </Box>

      {/* Learn Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{
            height: '80px',
            width: '220px',
            borderRadius: '30px',
            backgroundColor: '#92a6ba',
            border: 'none',
            fontWeight: 900,
            mt: '50px',
            textTransform: 'none',
            color: '#000',
            '&:hover': {
              backgroundColor: '#7a92a8',
            },
          }}
        >
          Learn! &gt;
        </Button>
      </Box>
    </Box>
  );
};

export default Stories;
