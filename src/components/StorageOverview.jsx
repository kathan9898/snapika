import React, { useEffect, useState } from 'react';
import getAccessToken from '../utils/getAccessToken';
import '../styles/storage.css';

export default function StorageOverview() {
  const [usage, setUsage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();

      let folders = [];
      try {
        folders = JSON.parse(process.env.REACT_APP_DRIVE_FOLDERS);
      } catch (e) {
        console.error("Invalid REACT_APP_DRIVE_FOLDERS JSON", e);
        return;
      }

      const usageData = [];

      for (const folder of folders) {
        try {
          const q = `'${folder.id}' in parents and trashed=false`;
          const fields = 'files(size,name)';
          const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=${fields}&pageSize=1000`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const json = await res.json();
          const totalBytes = (json.files || []).reduce((sum, file) => sum + (parseInt(file.size) || 0), 0);
          const totalMB = totalBytes / (1024 * 1024);

          usageData.push({
            name: folder.name,
            sizeMB: totalMB.toFixed(2),
            fileCount: json.files.length
          });
        } catch (err) {
          console.error(`Error fetching folder ${folder.name}`, err);
        }
      }

      setUsage(usageData);
    };

    fetchData();
  }, []);

  const getColor = (mb) => {
    if (mb < 100) return 'green';
    if (mb < 500) return 'orange';
    return 'red';
  };

  return (
    <div className="storage-container">
      <h2>📦 Google Drive Storage Overview</h2>
      {usage.map((folder, idx) => (
        <div key={idx} className="folder-usage">
          <div className="label">
            <strong>{folder.name}</strong> — {folder.sizeMB} MB ({folder.fileCount} files)
          </div>
          <div className="bar-wrapper">
            <div
              className="bar"
              style={{
                width: `${Math.min(folder.sizeMB, 1000) / 10}%`,
                backgroundColor: getColor(folder.sizeMB)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
