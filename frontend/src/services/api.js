import axios from 'axios';

// Ensure the frontend always calls the backend under the /api prefix.
// Normalize to avoid double `/api/api` when VITE_API_URL already includes `/api`.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedApiUrl = API_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: `${normalizedApiUrl}/api`,
});

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/uploadResume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const matchJobDescription = async (resumeText, jobDescription, userName = '', userEmail = '') => {
  const response = await api.post('/matchJob', {
    resumeText,
    jobDescription,
    userName,
    userEmail
  });
  return response.data;
};

export default api;
