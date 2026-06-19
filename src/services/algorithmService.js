import api from './api';

export const getAlgorithms = async () => {
  const response = await api.get('/algorithms');
  return response.data;
};

export const getAlgorithmSteps = async (algorithmId, array) => {
  const response = await api.post(`/algorithms/${algorithmId}/steps`, { array });
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