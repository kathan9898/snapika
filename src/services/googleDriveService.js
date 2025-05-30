export async function getFiles() {
  // Placeholder - replace with actual API call
  return [
    { id: '1', name: 'Image1.jpg', mimeType: 'image/jpeg', webContentLink: '#', thumbnailLink: '#' },
    { id: '2', name: 'Video1.mp4', mimeType: 'video/mp4', webContentLink: '#' }
  ];
}

export async function uploadFile(file) {
  // Placeholder - integrate Drive API later
  console.log("Uploading file:", file.name);
  return Promise.resolve();
}
