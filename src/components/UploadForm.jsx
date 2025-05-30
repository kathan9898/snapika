import React, { useState } from 'react';
import { uploadFile } from '../services/googleDriveService';
import { sendUploadMail } from '../services/mailService';

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    const email = localStorage.getItem("userEmail");
    try {
      await uploadFile(file);
      await sendUploadMail(email);
      alert("Upload complete & email sent.");
    } catch (err) {
      alert("Error during upload.");
    }
  };

  return (
    <div>
      <h2>Upload</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
