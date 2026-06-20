import React, { useState, useEffect } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import "./EditUser.css";

export default function EditUser() {

    const navigate = useNavigate();
    const { id } = useParams();

    const {
        users,
        editUser,
    } = useAdmin();

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

        const user = users.find(
            (u) => String(u.id) === String(id)
        );

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

        if (
            formData.password &&
            formData.password !== formData.confirmPassword
        ) {
            alert("Passwords do not match");
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

            await editUser(
                formData.id,
                payload
            );

            alert("Update User Success");

            navigate("/admin/users");

        } catch (err) {

            console.error(err);

            alert(
                err?.response?.data?.message ||
                "Update User Failed"
            );

        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="edit-user-page">

            <div className="breadcrumb">
                MANAGEMENT › USERS › EDIT USER
            </div>

            <div className="page-header">

                <h1>Edit User</h1>

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
                    <div className="form-group">

                        <label>STATUS</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value={1}>
                                ACTIVE
                            </option>

                            <option value={0}>
                                INACTIVE
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
                            value={formData.confirmPassword}
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