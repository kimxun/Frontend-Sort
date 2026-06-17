import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditUser.css";

export default function EditUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: 1,
        username: "admin",
        full_name: "Alex Dev",
        email: "alex@algostudio.io",
        role: 1,
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            formData.password &&
            formData.password !== formData.confirmPassword
        ) {
            alert("Passwords do not match");
            return;
        }

        console.log(formData);

        alert("Update Success");
    };

    return (
        <div className="edit-user-page">

            <div className="breadcrumb">
                MANAGEMENT › USERS › EDIT USER
            </div>

            <div className="page-header">
                <h1>Edit User</h1>

                <button
                    className="close-btn"
                    onClick={() => navigate("/admin/users")}
                >
                    ✕
                </button>
            </div>

            <form
                className="edit-user-form"
                onSubmit={handleSubmit}
            >

                <div className="form-row">
                    <div className="form-group large">
                        <label>USERNAME</label>

                        <input
                            type="text"
                            value={formData.username}
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>ROLE</label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={0}>
                                USER
                            </option>

                            <option value={1}>
                                ADMIN
                            </option>
                        </select>
                    </div>
                </div>

                <div className="form-row">

                    <div className="form-group">
                        <label>FULL NAME</label>

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
                        <label>
                            NEW PASSWORD
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Leave blank if unchanged"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            CONFIRM PASSWORD
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
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
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Update User
                    </button>

                </div>

            </form>

        </div>
    );
}