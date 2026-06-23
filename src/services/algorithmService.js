import api from './api';

export const getAlgorithms = async (page=1, limit=5) => {
  const response = await api.get(`/algorithms?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAlgorithmSteps = async (algorithmId, array, sortOrder) => {
  const response = await api.post(`/algorithms/${algorithmId}/steps`, { array, sortOrder });
  return response.data;
};

export const getAlgorithmById = async (id) => {
  const response = await api.get(`/algorithms/${id}`);
  return response.data;
};

export const createAlgorithm = async (data) => {
  const response = await api.post('/algorithms', data);
  return response.data;
};

export const updateAlgorithm = async (id, data) => {
  const response = await api.put(`/algorithms/${id}`, data);
  return response.data;
};

export const deleteAlgorithm = async (id) => {
  const response = await api.delete(`/algorithms/${id}`);
  return response.data;
};