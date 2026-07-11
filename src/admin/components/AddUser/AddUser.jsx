import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import { useAdmin } from "../../../context/AdminContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AddUser() {
    const navigate = useNavigate();
    const { addUser } = useAdmin();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        email: "",
        role: 0,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedUsername = formData.username.trim();
        const trimmedFullName = formData.full_name.trim();
        const trimmedEmail = formData.email.trim();

        if (!trimmedUsername) {
            toast.error("Vui lòng nhập tên đăng nhập");
            return;
        }
        if (!formData.password) {
            toast.error("Vui lòng nhập mật khẩu");
            return;
        }
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

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu không trùng khớp");
            return;
        }

        const payload = {
            username: trimmedUsername,
            password: formData.password,
            full_name: trimmedFullName,
            email: trimmedEmail,
            role: Number(formData.role),
            status: 1,
        };

        try {
            await addUser(payload);
            toast.success("Tạo người dùng thành công");
            navigate("/admin/users");
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Đã có lỗi xảy ra, vui lòng thử lại";
            toast.error(message);
        }
    };

    return (
        <div className="add-user-page">
            <div className="breadcrumb">
                QUẢN LÝ › NGƯỜI DÙNG › THÊM NGƯỜI DÙNG
            </div>

            <div className="page-header">
                <h1>Thêm người dùng mới</h1>

                <button
                    className="close-btn"
                    onClick={() => navigate("/admin/users")}
                >
                    ✕
                </button>
            </div>

            <form
                className="add-user-form"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <input type="text" style={{ display: "none" }} aria-hidden="true" />
                <input type="password" style={{ display: "none" }} aria-hidden="true" />

                <div className="form-row">
                    <div className="form-group large">
                        <label>TÊN ĐĂNG NHẬP</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Ví dụ: alexdev"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="nopermission"
                        />
                    </div>

                    <div className="form-group password-field">
                        <label>VAI TRÒ</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={0}>
                                NGƯỜI DÙNG (USER)
                            </option>

                            <option value={1}>
                                QUẢN TRỊ VIÊN (ADMIN)
                            </option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group password-field">
                        <label>HỌ VÀ TÊN</label>

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Ví dụ: Alex Dev"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Ví dụ: alex@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="nopermission"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>MẬT KHẨU</label>

                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Nhập mật khẩu..."
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className="form-group">
                        <label>XÁC NHẬN MẬT KHẨU</label>

                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Xác nhận lại mật khẩu..."
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
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
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/admin/users")}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Tạo người dùng
                    </button>
                </div>
            </form>
        </div>
    );
}
