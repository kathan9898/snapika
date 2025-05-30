import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import OTPVerify from './components/OTPVerify';
import Gallery from './components/Gallery';
import UploadForm from './components/UploadForm';

import './styles/main.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<OTPVerify />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/upload" element={<UploadForm />} />
      </Routes>
    </Router>
  );
}

export default App;
