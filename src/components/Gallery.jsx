import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { getFiles } from '../services/googleDriveService';

export default function Gallery() {
  const [media, setMedia] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchMedia() {
      const files = await getFiles();
      setMedia(files);
    }
    fetchMedia();
  }, []);

  const paginated = media.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {paginated.map(file => (
          <div key={file.id} className="media-item">
            {file.mimeType.includes("image") ? (
              <img src={file.thumbnailLink || file.webContentLink} alt="media" />
            ) : (
              <video controls src={file.webContentLink}></video>
            )}
            <p>{file.name}</p>
            <a href={file.webContentLink} target="_blank" rel="noreferrer">Download</a>
          </div>
        ))}
      </div>
      <Pagination total={media.length} perPage={itemsPerPage} onPageChange={setCurrentPage} />
    </div>
  );
}
