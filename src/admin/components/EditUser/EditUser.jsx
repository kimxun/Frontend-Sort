import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { toast } from "react-toastify";
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

        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu mới không trùng khớp!");
            return;
        }

        try {
            const payload = {
                full_name: formData.full_name,
                email: formData.email,
                role: Number(formData.role),
                status: Number(formData.status),
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await editUser(formData.id, payload);
            
            toast.success("Cập nhật thông tin người dùng thành công!");
            navigate("/admin/users");

        } catch (err) {
            console.error(err);
            
            const errorMessage = err?.response?.data?.message || err.message || "";
            
            if (errorMessage.includes("500") || (err.response && err.response.status === 500)) {
                toast.error("Lỗi máy chủ hoặc dữ liệu không hợp lệ!");
            } else {
                toast.error(`Cập nhật thông tin thất bại: ${errorMessage}`);
            }
            
            navigate("/admin/users");
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
                <button
                    className="close-btn"
                    onClick={() => navigate("/admin/users")}
                >
                    ✕
                </button>
            </div>

            <form className="edit-user-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group large">
                        <label>TÊN ĐĂNG NHẬP</label>
                        <input
                            type="text"
                            value={formData.username}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>VAI TRÒ</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={0}>NGƯỜI DÙNG (USER)</option>
                            <option value={1}>QUẢN TRỊ VIÊN (ADMIN)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>TRẠNG THÁI</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value={1}>HOẠT ĐỘNG</option>
                            <option value={0}>TẠM KHÓA</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>HỌ VÀ TÊN</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>MẬT KHẨU MỚI</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Để trống nếu không muốn thay đổi"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>XÁC NHẬN MẬT KHẨU MỚI</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận lại mật khẩu mới"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
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

                    <button type="submit" className="save-btn">
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
}