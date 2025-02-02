import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Talk from './pages/Talk';
import Learn from './pages/Learn';
import About from './pages/About';
import Lesson from './pages/Lesson';
import Stories from './pages/Stories';
import Games from './pages/Games';
import FunFacts from './pages/FunFacts';
import Histories from './pages/Histories';
import Resources from './pages/Resources';

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Navbar should be outside of Routes */}
      <Navbar />

      {/* Main Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/games" element={<Games />} />
        <Route path="/fun-facts" element={<FunFacts />} />
        <Route path="/histories" element={<Histories />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>

      {/* Footer should be outside of Routes */}
      <Footer />
      </Box>
    </Router>
  );
};

export default App;
