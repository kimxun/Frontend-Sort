import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./Forbidden.css";

export default function Forbidden({ darkMode, onToggleTheme }) {
    return (
        <div className="forbidden-container">
            <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} className="auth-theme-toggle" />
            <div className="forbidden-card">
                <h1>403</h1>
                <h2>Không có quyền truy cập</h2>
                <p>
                    Bạn không có quyền truy cập trang quản trị.
                </p>

                <Link to="/" className="home-btn">
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}
