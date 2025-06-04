import React, { useState, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('');
  const fileInputRef = useRef(null);

  // Load folders from .env
  const folderOptions = useMemo(() => {
    try {
      return JSON.parse(process.env.REACT_APP_DRIVE_FOLDERS || '[]');
    } catch {
      return [];
    }
  }, []);

  const handleUpload = async () => {
    if (!files.length || !selectedFolder) return alert('Please select a folder and files');

    setUploading(true);
    const token = await getAccessToken();

    const updatedStatuses = Array.from(files).map(f => ({ name: f.name, status: 'Pending' }));
    setFileStatuses(updatedStatuses);

    for (const file of files) {
      updateStatus(file.name, 'Uploading');

      const metadata = {
        name: file.name,
        mimeType: file.type,
        parents: [selectedFolder],
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      try {
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });

        if (res.ok) {
          updateStatus(file.name, '✅ Done');
        } else {
          updateStatus(file.name, '❌ Error');
        }
      } catch {
        updateStatus(file.name, '❌ Error');
      }
    }

    triggerFireworks();
    setUploading(false);
    setFiles([]);
    fileInputRef.current.value = '';
    setSelectedFolder('');
  };

  const updateStatus = (fileName, status) => {
    setFileStatuses(prev =>
      prev.map(f => (f.name === fileName ? { ...f, status } : f))
    );
  };

  const triggerFireworks = () => {
    const end = Date.now() + 1200;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 300);
  };

  return (
    <div className="container">
      <h3>📂 Custom Upload to Selected Folder</h3>

      <label>Select Google Drive Folder:</label><br />
      <select value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} required>
        <option value="">-- Choose Folder --</option>
        {folderOptions.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <br /><br />
      <input type="file" multiple ref={fileInputRef} onChange={(e) => setFiles(e.target.files)} />
      <br /><br />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Start Upload'}
      </button>

      {fileStatuses.map((f, i) => (
        <p key={i}>{f.name} — <strong>{f.status}</strong></p>
      ))}
    </div>
  );
}

// 🔐 OAuth JWT Token (Browser-friendly)
async function getAccessToken() {
  const jwtHeader = {
    alg: "RS256",
    typ: "JWT"
  };

  const jwtClaim = {
    iss: process.env.REACT_APP_GDRIVE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive",
    aud: "https://oauth2.googleapis.com/token",
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    iat: Math.floor(Date.now() / 1000)
  };

  function base64url(source) {
    return btoa(String.fromCharCode(...new Uint8Array(source)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const header = base64url(encoder.encode(JSON.stringify(jwtHeader)));
  const claim = base64url(encoder.encode(JSON.stringify(jwtClaim)));
  const input = `${header}.${claim}`;

  const privateKey = process.env.REACT_APP_GDRIVE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const cryptoKey = await window.crypto.subtle.importKey(
    'pkcs8',
    str2ab(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, encoder.encode(input));
  const signedJWT = `${input}.${base64url(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJWT}`
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(tokenJson.error_description);
  return tokenJson.access_token;
}

function str2ab(pem) {
  const b64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
