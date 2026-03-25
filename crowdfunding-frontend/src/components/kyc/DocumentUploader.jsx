import React from 'react';

const DocumentUploader = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    onUpload(files);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
    </div>
  );
};

export default DocumentUploader;