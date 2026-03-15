import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';

const UploadResume = ({ onFileUpload, isUploading, file }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  return (
    <div className="component-card upload-section">
      <h2 className="section-title">1. Upload Resume</h2>
      <p className="section-subtitle">PDF or TXT format</p>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <div className="file-preview">
            <FiFileText className="file-icon accent" />
            <p className="file-name">{file.name}</p>
            <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <FiUploadCloud className="upload-icon" />
            {isDragActive ? (
              <p>Drop the resume here...</p>
            ) : (
              <p>Drag 'n' drop your resume here, or <span className="accent">click to browse</span></p>
            )}
          </div>
        )}
      </div>
      {isUploading && <div className="loader">Extracting text...</div>}
    </div>
  );
};

export default UploadResume;
