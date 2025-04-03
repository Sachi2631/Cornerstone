import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Watch from './pages/Watch';
import Talk from './pages/Talk';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/talk" element={<Talk />} />
      </Routes>
    </Router>
  );
};

export default App;
