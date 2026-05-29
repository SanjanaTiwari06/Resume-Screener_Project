import axios from 'axios';

const api = axios.create({
  baseURL: 'https://resume-screener-project-ad2o.onrender.com/api'
});

export const analyzeResumes = (formData) =>
  api.post('/jobs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getJobs = () => api.get('/jobs');

export const getCandidates = (jobId, params = {}) =>
  api.get(`/jobs/${jobId}/candidates`, { params });

export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);

export default api;
