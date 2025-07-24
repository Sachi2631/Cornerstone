import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Watch from './pages/Watch';
import Talk from './pages/Talk';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FunFacts from './pages/FunFacts';
import Header from './components/Header'; // ✅ import Header
import Footer from './components/Footer'; // ✅ import Footer
import { Box } from '@mui/material'; // ✅ for flex column layout

const App: React.FC = () => {
  return (
    <Router>
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />

        <Box component="main" flexGrow={1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/talk" element={<Talk />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/funfacts" element={<FunFacts />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
};

export default App;
