import api from './api';

export const getAlgorithms = async (page=1, limit=5) => {
  const response = await api.get(`/algorithms?page=${page}&limit=${limit}`);
  return response.data;
};

// SỬA ĐỔI HÀM NÀY ĐỂ TÍCH HỢP REDIS VÀ KHỚP VỚI FLASK BACKEND
export const getAlgorithmSteps = async (algorithmName, array, sortOrder) => {
  // 1. Lấy token và guest_id từ localStorage
  const token = localStorage.getItem('token'); // Thay bằng key bạn dùng lưu JWT (VD: access_token)
  const guestId = localStorage.getItem('guest_id');

  // 2. Thiết lập headers
  const headers = {
    'Guest-ID': guestId // Bắt buộc phải có để backend check Redis
  };

  // Nếu đã đăng nhập thì đính kèm thêm JWT
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Gửi request chuẩn khớp với data backend cần: { array, algorithm }
  // Lưu ý: Hãy đổi lại URL bên dưới nếu URL gốc của blueprint backend là đường dẫn khác (VD: '/api/sort' hoặc '/sort')
  const response = await api.post('/sort', 
    { 
      array: array, 
      algorithm: algorithmName // Backend cần chuỗi string như 'quick_sort', 'selection_sort'
    }, 
    { headers } // Truyền config headers vào axios
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

export const deleteAlgorithm = async (id) => {
  const response = await api.delete(`/algorithms/${id}`);
  return response.data;
};