import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import Gallery from './Gallery';
import UploadToDrive from './UploadToDrive';
import StorageOverview from './StorageOverview';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const isVerified = localStorage.getItem("Verfied");

  useEffect(() => {
    if (!email) navigate('/');
  }, [navigate, email]);
  
useEffect(() => {
  if (!isVerified) navigate('/');
}, [navigate, isVerified]);
  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("Verfied");
    navigate('/');
  };

  return (
    <div className="side-layout">
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <button className="toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

        {menuOpen && (
          <>
            <div className="nav-items">
              <button
                className={activeTab === 'upload' ? 'active' : ''}
                onClick={() => setActiveTab('upload')}
              >
                📤 Upload
              </button>
              <button
                className={activeTab === 'gallery' ? 'active' : ''}
                onClick={() => setActiveTab('gallery')}
              >
                🖼 Gallery
              </button>
              <button
                className={activeTab === 'custom' ? 'active' : ''}
                onClick={() => setActiveTab('custom')}
              >
                📂 Custom Upload
              </button>
              <button onClick={() => setActiveTab('storage')}>📦 Storage</button>

            </div>

            <div className="sidebar-footer">
              <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>Logged in as:</p>
              <p style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{email}</p>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          </>
        )}
      </div>

      <div className="content-area">
        {activeTab === 'upload' && <UploadForm />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'custom' && <UploadToDrive />}
        {activeTab === 'storage' &&<StorageOverview />}
      </div>
    </div>
  );
}
