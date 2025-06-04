import React, { useEffect, useState, useCallback } from 'react';
import getAccessToken from '../utils/getAccessToken';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../styles/gallery.css';
import { format } from 'date-fns';

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [selected, setSelected] = useState([]);
  const [selecting, setSelecting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllFiles = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const folders = process.env.REACT_APP_GDRIVE_FOLDER_IDS.split(',');
      let all = [];

      for (const folderId of folders) {
        const q = `'${folderId}' in parents and trashed=false`;
        const fields = 'files(id,name,thumbnailLink,webContentLink,webViewLink,mimeType,createdTime)';
        const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${fields}&orderBy=modifiedTime desc`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        all = [...all, ...(json.files || [])];
      }

      all.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      setFiles(all);

      const groups = {};
      all.forEach(f => {
        const month = format(new Date(f.createdTime), 'MMMM yyyy');
        if (!groups[month]) groups[month] = [];
        groups[month].push(f);
      });

      setGrouped(groups);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFiles();
  }, [fetchAllFiles]);

  const handleFileClick = (file) => {
    if (selecting) {
      setSelected(prev =>
        prev.some(f => f.id === file.id)
          ? prev.filter(f => f.id !== file.id)
          : [...prev, file]
      );
    } else {
      window.open(file.webViewLink, '_blank');
    }
  };

  const handleLongPress = () => setSelecting(true);

 const handleDownload = () => {
  let delay = 0;

  selected.forEach((file, index) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = file.webContentLink;
      a.download = file.name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, delay);

    delay += 500; // 0.5 second delay between each file
  });

  setSelected([]);
  setSelecting(false);
};


  return (
    <div className="gallery-container">
      <h2>📁 Gallery</h2>

      {selecting && (
        <button onClick={handleDownload} className="download-btn">
          ⬇️ Download ({selected.length})
        </button>
      )}

      {loading && <p>Loading files...</p>}

      {!loading && files.length === 0 && (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          No files found in the linked Google Drive folders.
        </p>
      )}

      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="month-section">
          <h3>{month}</h3>
          <div className="thumbnail-grid">
            {items.map(file => (
              <div
                key={file.id}
                className={`thumbnail ${selected.some(f => f.id === file.id) ? 'selected' : ''}`}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress();
                }}
                role="button"
                aria-label={`Open ${file.name}`}
              >
               <LazyLoadImage
                src={file.thumbnailLink || file.webContentLink}
                alt={file.name}
                effect="blur"
                className="thumb-img"
              />
                <p className="file-name">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
