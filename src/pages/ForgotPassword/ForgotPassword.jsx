import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword, verifyOtp } from '../../services/authService';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './ForgotPassword.css';

const OTP_LENGTH = 6;
const OTP_TTL = 60;

const ForgotPassword = ({ darkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, timeLeft]);

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await forgotPassword(email.trim());
    setLoading(false);

    if (!result.success) {
      showError(result.message);
      return;
    }

    setStep('otp');
    setOtpValues(Array(OTP_LENGTH).fill(''));
    setTimeLeft(result.data?.ttl || OTP_TTL);
    toast.success(result.message || 'OTP đã được gửi đến email của bạn');
    setTimeout(() => otpRefs.current[0]?.focus(), 0);
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otpValues];
    nextOtp[index] = digit;
    setOtpValues(nextOtp);

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const otp = otpValues.join('');
    if (otp.length !== OTP_LENGTH) {
      showError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email.trim(), otp);
    setLoading(false);

    if (!result.success) {
      showError(result.message);
      return;
    }

    setStep('reset');
    toast.success(result.message || 'Xác thực OTP thành công');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      showError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email.trim(), newPassword, confirmPassword);
    setLoading(false);

    if (!result.success) {
      showError(result.message);
      return;
    }

    toast.success(result.message || 'Đổi mật khẩu thành công');
    navigate('/login');
  };

  return (
    <div className="forgot-container">
      <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} className="auth-theme-toggle" />
      <div className="forgot-card">
        <h2>{step === 'reset' ? 'Đổi mật khẩu' : 'Quên mật khẩu'}</h2>

        {step === 'email' && (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <p className="forgot-note">OTP đã được gửi đến {email.trim()}.</p>
            <div className="otp-row">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  className="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  aria-label={`OTP số ${index + 1}`}
                />
              ))}
            </div>
            <div className={`countdown ${timeLeft === 0 ? 'expired' : ''}`}>
              {timeLeft > 0 ? `OTP còn hiệu lực trong ${timeLeft}s` : 'OTP đã hết hạn'}
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="forgot-btn" disabled={loading || timeLeft === 0}>
              {loading ? 'Đang xác nhận...' : 'Xác nhận OTP'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleSendOtp}
              disabled={loading || timeLeft > 0}
            >
              Gửi lại OTP
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength="8"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="8"
                required
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="forgot-btn" disabled={loading}>
              {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}

        <Link to="/login" className="back-login">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
