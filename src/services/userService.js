import api from './api';

export const getUsers = async (page = 1, limit = 5) => {
  const response = await api.get( `/users?page=${page}&limit=${limit}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id, options = { type: 'soft' }) => {
  const response = await api.delete(`/users/${id}`, {
    data: { permanent: options.type === 'hard' }
  });
  return response.data;
};
