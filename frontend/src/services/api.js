import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/uploadResume', formData);
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
