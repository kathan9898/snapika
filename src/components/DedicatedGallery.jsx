import React, { useEffect, useState, useCallback } from 'react';
import getAccessToken from '../utils/getAccessToken';
import { format } from 'date-fns';
import '../styles/dedicatedGallery.css';

export default function DedicatedGallery() {
  const [groupedMedia, setGroupedMedia] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAllFiles = useCallback(async () => {
    const folders = JSON.parse(process.env.REACT_APP_DRIVE_FOLDERS || '[]');
    const token = await getAccessToken();
    let all = [];

    for (const folder of folders) {
      const q = `'${folder.id}' in parents and trashed=false`;
      const fields = 'files(id,name,webContentLink,webViewLink,thumbnailLink,mimeType,createdTime)';
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${fields}&orderBy=modifiedTime desc`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const json = await res.json();
      all.push(...(json.files || []));
    }

    all.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

    const grouped = {};
    all.forEach(file => {
      const key = format(new Date(file.createdTime), 'MMMM yyyy');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(file);
    });

    setGroupedMedia(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllFiles();
  }, [fetchAllFiles]);

  const toggleShowMore = (month) => {
    setExpanded(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const renderMedia = (file) => {
    const isVideo = file.mimeType.startsWith('video/');
    const mediaSrc = file.thumbnailLink || file.webContentLink;

    return (
      <div key={file.id} className="media-tile" onClick={() => window.open(file.webViewLink, '_blank')}>
        {isVideo ? (
          <video src={mediaSrc} controls preload="metadata" />
        ) : (
          <img src={mediaSrc} alt={file.name} loading="lazy" />
        )}
        <p>{file.name}</p>
      </div>
    );
  };

  if (loading) return <p className="loading-msg">🔄 Loading gallery...</p>;

  return (
    <div className="dedicated-gallery">
      <h2>📂 Snapika Gallery</h2>
      {Object.entries(groupedMedia).map(([month, files]) => {
        const visibleFiles = expanded[month] ? files : files.slice(0, 7);
        return (
          <div key={month} className="month-section">
            <div className="month-header">
              <h3>{month}</h3>
              {files.length > 7 && (
                <button className="toggle-btn" onClick={() => toggleShowMore(month)}>
                  {expanded[month] ? 'Show Less' : `Show More for ${month}`}
                </button>
              )}
            </div>
            <div className="media-grid">
              {visibleFiles.map(renderMedia)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
