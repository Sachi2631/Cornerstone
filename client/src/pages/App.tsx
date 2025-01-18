import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Learn from './pages/Learn';
import Resources from './pages/Resources';
import Start from './pages/Start';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/Resources" element={<Resources />} />
            <Route path="/Start" element={<Start />} />

        </Routes>
    );
};

export default App;