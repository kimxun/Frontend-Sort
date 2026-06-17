import api from './api';

export const getSimulations = async () => {
  const response = await api.get('/simulations');
  return response.data;
};

export const getSimulationById = async (id) => {
  const response = await api.get(`/simulations/${id}`);
  return response.data;
};

export const getSimulationsByUser = async (userId) => {
  const response = await api.get(`/simulations/user/${userId}`);
  return response.data;
};

export const createSimulation = async (data) => {
  const response = await api.post('/simulations', data);
  return response.data;
};

export const updateSimulation = async (id, data) => {
  const response = await api.put(`/simulations/${id}`, data);
  return response.data;
};

export const deleteSimulation = async (id) => {
  const response = await api.delete(`/simulations/${id}`);
  return response.data;
};