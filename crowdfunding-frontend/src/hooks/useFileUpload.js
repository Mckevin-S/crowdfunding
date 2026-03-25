import { useState } from 'react';

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setUploading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  };

  return { uploadFile, uploading, error };
};