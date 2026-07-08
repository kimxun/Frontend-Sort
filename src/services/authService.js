  import api from './api';

  export const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('freeUsageCount');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, message };
    }
  };

  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  export const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể gửi OTP';
      return { success: false, message };
    }
  };

  export const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Xác thực OTP thất bại';
      return { success: false, message };
    }
  };

  export const resetPassword = async (email, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        newPassword,
        confirmPassword
      });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      return { success: false, message };
    }
  };
