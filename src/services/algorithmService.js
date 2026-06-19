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
