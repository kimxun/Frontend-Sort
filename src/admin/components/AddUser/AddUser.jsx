import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import { useAdmin } from "../../../context/AdminContext";

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu không trùng khớp!");
            return;
        }
        try {
            const payload = {
                username: formData.username,
                password: formData.password,
                full_name: formData.full_name,
                email: formData.email,
                role: Number(formData.role),
            };
            await addUser(payload);
            alert("Tạo người dùng thành công!");
            navigate("/admin/users");
        } catch (err) {
            alert("Tạo người dùng thất bại: " + err.message);
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
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >
                    ✕
                </button>
            </div>

            <form
                className="add-user-form"
                onSubmit={handleSubmit}
            >

                <div className="form-row">
                    <div className="form-group large">
                        <label>TÊN ĐĂNG NHẬP</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Ví dụ: alexdev"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
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
                    <div className="form-group">
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
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>MẬT KHẨU</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu..."
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>XÁC NHẬN MẬT KHẨU</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận lại mật khẩu..."
                            value={
                                formData.confirmPassword
                            }
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="button-group">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/admin/users")
                        }
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