import api from './api';

const getGuestId = () => localStorage.getItem('guest_id');

export const getAlgorithms = async (page = 1, limit = 5) => {
  const response = await api.get(`/algorithms?page=${page}&limit=${limit}`);
  return response.data;
};

export const getActiveAlgorithms = async () => {
  const response = await api.get('/algorithms');
  return response.data;
};

export const getAlgorithmSteps = async (algorithm, array, sortOrder) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const guestId = getGuestId();
    if (guestId) {
      headers['X-Guest-ID'] = guestId;
    }
  }

  const response = await api.post('/algorithms/sort',
    {
      array: array,
      algorithm_id: algorithm.id,
      algorithm: algorithm.slug,
      sortOrder: sortOrder
    },
    { headers }
  );

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

export const deleteAlgorithm = async (id, options = { type: 'soft' }) => {
  const response = await api.delete(`/algorithms/${id}`, {
    data: { permanent: options.type === 'hard' }
  });
  return response.data;
};

export const searchAlgorithmSteps = async (algorithm, array, target) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const guestId = getGuestId();
    if (guestId) {
      headers['X-Guest-ID'] = guestId;
    }
  }

  const response = await api.post(`/algorithms/${algorithm.id}/search`,
    {
      array: array,
      target: target
    },
    { headers }
  );

  return response.data;
};

export const uploadAlgorithmCode = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/algorithms/upload-code', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};