import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadResume from '../components/UploadResume';
import JobDescriptionInput from '../components/JobDescriptionInput';
import { uploadResumeFile, matchJobDescription } from '../services/api';

const Home = () => {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsUploading(true);
    setError('');
    try {
      const response = await uploadResumeFile(uploadedFile);
      setResumeText(response.resumeText);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to extract text from resume.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError('Please upload a resume first.');
      return;
    }
    if (!jobDescription) {
      setError('Please paste a job description.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    try {
      const matchResult = await matchJobDescription(resumeText, jobDescription);
      navigate('/results', { state: { matchResult } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h2>Maximize Your Interview Chances</h2>
        <p>Upload your resume, paste the job description, and let our AI calculate your skill match score instantly.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid-layout">
        <UploadResume 
          onFileUpload={handleFileUpload} 
          isUploading={isUploading} 
          file={file} 
        />
        <JobDescriptionInput 
          value={jobDescription} 
          onChange={setJobDescription} 
        />
      </div>

      <div className="action-section">
        <button 
          className={`primary-btn ${isAnalyzing || !resumeText || !jobDescription ? 'disabled' : ''}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !resumeText || !jobDescription}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </div>
    </div>
  );
};

export default Home;
