import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
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
