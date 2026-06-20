import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.css';

const Login = () => {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(
      username,
      password
    );

    if (result.success) {
      // chuyển trang theo role
      if (result.user.role === 1) {

        navigate('/admin');

      } else {

        navigate('/');
      }

    } else {

      setError(result.message);
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
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
            />

          </div>

          <div className="input-group">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <label className="show-password">

              <input
                type="checkbox"
                checked={showPassword}
                onChange={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              />

              Hiện mật khẩu

            </label>

          </div>

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            Đăng nhập
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;