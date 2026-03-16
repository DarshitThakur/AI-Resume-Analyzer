import axios from 'axios';

// Ensure the frontend always calls the backend under the /api prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const res = await fetch(`${API_URL}/api/uploadResume`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw { response: { data: errorData } };
  }
  return await res.json();
};

export const matchJobDescription = async (resumeText, jobDescription, userName = '', userEmail = '') => {
  const response = await api.post('/api/matchJob', {
    resumeText,
    jobDescription,
    userName,
    userEmail
  });
  return response.data;
};

export default api;
