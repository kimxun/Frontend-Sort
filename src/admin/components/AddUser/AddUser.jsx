import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";

export default function AddUser() {
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            alert("Passwords do not match");
            return;
        }

        console.log(formData);

        alert("Create User Success");
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
                        <label>USERNAME</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="e.g. alexdev"
                            value={formData.username}
                            onChange={handleChange}
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
                        />
                    </div>

                    <div className="form-group">
                        <label>CONFIRM PASSWORD</label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password..."
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
                        Create User
                    </button>

                </div>

            </form>
        </div>
    );
}