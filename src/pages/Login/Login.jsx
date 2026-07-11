import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { getCurrentUser } from '../../services/authService';
import './Login.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      if (user.role === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);

    if (result.success) {
      if (result.user.role === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
      toast.error(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <label className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Hiện mật khẩu</span>
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
          <div className="auth-links">
            <Link to="/register" className="register-link">
              Đăng ký
            </Link>

            <Link to="/forgot-password" className="forgotpassword-link">
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
