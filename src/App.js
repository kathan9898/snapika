import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import OTPVerify from './components/OTPVerify';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DedicatedGallery from './components/DedicatedGallery';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/verify"
        element={
          <ProtectedRoute>
            <OTPVerify />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/dedicated-gallery" element={<DedicatedGallery />} /> */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Fallback to login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
