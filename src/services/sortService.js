import api from './api';

export const sortArray = async (array, algorithm) => {
  const response = await api.post('/sort', { array, algorithm });
  return response.data;
};