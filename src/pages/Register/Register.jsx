import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { register } from '../../services/registerService';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

const Register = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    const result = await register(
      formData.full_name,
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      toast.success(result.message || 'Đăng ký thành công!');
      navigate('/login');
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  return (
    <div className="register-container">
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} className="auth-theme-toggle" />
      <div className="register-card">
        <h2>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="full_name"
              placeholder="Họ và tên"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="register-btn">
            Đăng ký
          </button>
          <Link to="/login" className="back-login">
            Đã có tài khoản? Đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
