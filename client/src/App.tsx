import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Watch from './pages/Watch';
import Talk from './pages/Talk';
import AuthForm from './pages/AuthForm';
import Resources from './pages/Resources';
import FunFacts from './pages/FunFacts';
import Gallery from './pages/Gallery';
import Stories from './pages/Stories';
import CharInfo from './pages/CharInfo';

import Header from './components/Header';
import Footer from './components/Footer';

import { Box } from '@mui/material';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;
  const hideFooter = path === '/dashboard';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <ScrollToTop />

      <Box component="main" flexGrow={1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/talk" element={<Talk />} />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm />} />
          <Route path="/funfacts" element={<FunFacts />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/stories" element={<Stories />} />

          {/* NEW: dynamic character detail route */}
          <Route path="/characters/:id" element={<CharInfo />} />

          {/* Optional: keep old /charinfo route working by redirecting to gallery */}
          <Route path="/charinfo" element={<Navigate to="/gallery" replace />} />

          {/* Optional: 404 fallback */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
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
