import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Watch from './pages/Watch';
import Talk from './pages/Talk';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FunFacts from './pages/FunFacts';
import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/dashboard';

  return (
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

      {!hideFooter && <Footer />}
    </Box>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
