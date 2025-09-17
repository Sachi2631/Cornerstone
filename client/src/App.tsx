import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Watch from './pages/Watch';
import Talk from './pages/Talk';
import AuthForm from './pages/AuthForm';
import Resources from './pages/Resources';
import FunFacts from './pages/FunFacts';
import Gallery from './pages/Gallery';
import Stories from './pages/Stories';
import CharInfo from './pages/CharInfo';
import Profile from './pages/Profile';

import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';

// ----- Simple auth check (swap with your real selector/context) -----
const isAuthed = () => Boolean(localStorage.getItem('authToken'));

// ----- Route guards -----
const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  if (!isAuthed()) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return children;
};

const PublicOnly: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  if (isAuthed()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

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

  // Hide rules (unchanged)
  const hideHeader = path === '/lesson';
  const hideFooter = path === '/dashboard';

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {!hideHeader && <Header />}
      <ScrollToTop />

      <Box component="main" flexGrow={1}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/funfacts" element={<FunFacts />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/characters/:id" element={<CharInfo />} />
          <Route path="/charinfo" element={<Navigate to="/gallery" replace />} />

          {/* Public-only (alias /auth) */}
          <Route
            path="/auth"
            element={
              <PublicOnly>
                <AuthForm />
              </PublicOnly>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <AuthForm />
              </PublicOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnly>
                <AuthForm />
              </PublicOnly>
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/lesson"
            element={
              <RequireAuth>
                <Lesson />
              </RequireAuth>
            }
          />
          <Route
            path="/watch"
            element={
              <RequireAuth>
                <Watch />
              </RequireAuth>
            }
          />
          <Route
            path="/talk"
            element={
              <RequireAuth>
                <Talk />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
