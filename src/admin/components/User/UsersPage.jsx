import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAdmin } from "../../../context/AdminContext";
import "./UsersPage.css";

const avatarColors = [
    "#6d4aff",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
];

function Avatar({ name, idx }) {
    const initials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div
            className="avatar"
            style={{
                background: avatarColors[idx % avatarColors.length],
            }}
        >
            {initials}
        </div>
    );
}

export default function UsersPage() {

    const navigate = useNavigate();

    const {
        users,
        loading,
        error,
        removeUser,
    } = useAdmin();

    const [search, setSearch] = useState("");

    const handleDelete = async (user) => {

        const confirmDelete = window.confirm(
            ` Bạn có chắc muốn khóa tài khoản "${user.username}"?`
        );

        if (!confirmDelete) return;

        try {

            await removeUser(user.id);

            alert("Khóa tài khoản thành công");

        } catch (err) {

            alert("Khóa tài khoản thất bại");

        }
    };

    const filtered = users.filter(
        (u) =>
            u.full_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            u.email
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            u.username
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <div className="users-page">

            <div className="header">

                <h1>User Management</h1>

                <button
                    className="invite-btn"
                    onClick={() => navigate("/admin/add-user")}
                >
                    + Invite User
                </button>

            </div>

            <div className="stats">

                <div className="card">
                    <span>TOTAL USERS</span>
                    <h2>{users.length}</h2>
                </div>

                <div className="card">
                    <span>ACTIVE USERS</span>
                    <h2>{users.filter((u) => u.status === 1).length}</h2>
                </div>

                <div className="card">
                    <span>ADMINS</span>
                    <h2>
                        {
                            users.filter((u) => u.role === 1).length
                        }
                    </h2>
                </div>

            </div>

            <div className="table-container">

                <div className="toolbar">

                    <input
                        type="text"
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                {
                    loading ? (

                        <p className="loading-text">
                            Đang tải dữ liệu...
                        </p>

                    ) : error ? (

                        <p className="error-text">
                            {error}
                        </p>

                    ) : (

                        <table>

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    filtered.map((user, idx) => (

                                        <tr key={user.id}>

                                            <td>

                                                <div className="user-info">

                                                    <Avatar
                                                        name={user.full_name}
                                                        idx={idx}
                                                    />

                                                    <div>

                                                        <div className="name">
                                                            {user.full_name}
                                                        </div>

                                                        <div className="email">
                                                            {user.email}
                                                        </div>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>{user.username}</td>

                                            <td>{user.email}</td>

                                            <td>

                                                <span
                                                    className={`role-badge ${user.role === 1
                                                            ? "role-admin"
                                                            : "role-user"
                                                        }`}
                                                >
                                                    {user.role === 1
                                                        ? "ADMIN"
                                                        : "USER"}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${user.status === 1
                                                            ? "status-active"
                                                            : "status-inactive"
                                                        }`}
                                                >
                                                    {user.status === 1
                                                        ? "ACTIVE"
                                                        : "INACTIVE"}
                                                </span>

                                            </td>

                                            <td>
                                                {user.created_at}
                                            </td>

                                            <td>

                                                <div className="action-group">

                                                    <button
                                                        className="action-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/edit-user/${user.id}`
                                                            )
                                                        }
                                                    >
                                                        <FiEdit2 />
                                                    </button>

                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                    >
                                                        <FiTrash2 />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    )
                }

            </div>

        </div>
    );
}