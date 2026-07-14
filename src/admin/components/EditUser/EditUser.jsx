import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./EditUser.css";

export default function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { users, editUser } = useAdmin();

    const [formData, setFormData] = useState({
        id: "",
        username: "",
        full_name: "",
        email: "",
        role: 1,
        status: 1,
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const user = users.find((u) => String(u.id) === String(id));
        if (user) {
            setFormData({
                id: user.id,
                username: user.username || "",
                full_name: user.full_name || "",
                email: user.email || "",
                role: user.role ?? 1,
                status: user.status ?? 1,
                password: "",
                confirmPassword: "",
            });
        }
        setLoading(false);
    }, [id, users]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedFullName = formData.full_name.trim();
        const trimmedEmail = formData.email.trim();

        if (!trimmedFullName) {
            toast.error("Vui lòng nhập họ và tên");
            return;
        }

        if (!trimmedEmail) {
            toast.error("Vui lòng nhập email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Email không đúng định dạng");
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu mới không trùng khớp!");
            return;
        }

        try {
            const payload = {
                full_name: trimmedFullName,
                email: trimmedEmail,
                role: Number(formData.role),
                status: Number(formData.status),
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await editUser(formData.id, payload);
            navigate("/admin/users");
        } catch {
            // AdminContext already shows the API error toast.
        }
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    return (
        <div className="edit-user-page">
            <div className="breadcrumb">
                QUẢN LÝ › NGƯỜI DÙNG › CHỈNH SỬA NGƯỜI DÙNG
            </div>
            <div className="page-header">
                <h1>Chỉnh sửa người dùng</h1>
                <button className="close-btn" onClick={() => navigate("/admin/users")}>✕</button>
            </div>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group large">
                        <label>TÊN ĐĂNG NHẬP</label>
                        <input type="text" value={formData.username} disabled />
                    </div>
                    <div className="form-group">
                        <label>VAI TRÒ</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value={0}>NGƯỜI DÙNG (USER)</option>
                            <option value={1}>QUẢN TRỊ VIÊN (ADMIN)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>TRẠNG THÁI</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value={1}>HOẠT ĐỘNG</option>
                            <option value={0}>TẠM KHÓA</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>HỌ VÀ TÊN</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>EMAIL</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group password-field">
                        <label>MẬT KHẨU MỚI</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Để trống nếu không muốn thay đổi"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <div className="form-group password-field">
                        <label>XÁC NHẬN MẬT KHẨU MỚI</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Xác nhận lại mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="eye-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </div>
                <div className="button-group">
                    <button type="button" className="cancel-btn" onClick={() => navigate("/admin/users")}>Hủy bỏ</button>
                    <button type="submit" className="save-btn">Cập nhật</button>
                </div>
            </form>
        </div>
    );
}
