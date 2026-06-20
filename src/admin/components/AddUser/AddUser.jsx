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
            alert("Passwords do not match");
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
            alert("User created successfully");
            navigate("/admin/users");
        } catch (err) {
            alert("Failed to create user: " + err.message);
        }
    };

    return (
        <div className="add-user-page">
            <div className="breadcrumb">
                MANAGEMENT › USERS › NEW USER
            </div>

            <div className="page-header">
                <h1>New User</h1>
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
                {/* ─── MẸO ĐÁNH LỪA TRÌNH DUYỆT ───────────────────────────────── */}
                {/* Trình duyệt sẽ tự động điền tài khoản admin vào 2 ô ẩn này và bỏ qua các ô bên dưới */}
                <input type="text" style={{ display: "none" }} aria-hidden="true" />
                <input type="password" style={{ display: "none" }} aria-hidden="true" />
                {/* ──────────────────────────────────────────────────────────── */}

                <div className="form-row">
                    <div className="form-group large">
                        <label>USERNAME</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="e.g. alexdev"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="nopermission" 
                        />
                    </div>

                    <div className="form-group">
                        <label>ROLE</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={0}>USER</option>
                            <option value={1}>ADMIN</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>FULL NAME</label>
                        <input
                            type="text"
                            name="full_name"
                            placeholder="e.g. Alex Dev"
                            value={formData.full_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g. alex@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="nopermission"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>PASSWORD</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password..."
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password" 
                        />
                    </div>

                    <div className="form-group">
                        <label>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password..."
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password" 
                        />
                    </div>
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => navigate("/admin/users")}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    );
}