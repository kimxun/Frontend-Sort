import { Link } from "react-router-dom";
import "./Forbidden.css";

export default function Forbidden() {
    return (
        <div className="forbidden-container">
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