import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAdmin } from "../../../context/AdminContext";
import "./UsersPage.css";

const avatarColors = ["#6d4aff", "#3b82f6", "#22c55e", "#ef4444"];

function Avatar({ name, idx }) {
    const initials = name
        ? name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "";

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
        users = [],
        loading,
        userError, // Đã đổi từ error -> userError
        removeUser,
        pagination,
        setPage, // Lấy setPage từ Context
    } = useAdmin();

    const [search, setSearch] = useState("");

    // ================= CURRENT PAGE FROM BACKEND =================
    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    // ================= SEARCH (TEMP FRONTEND) =================
    // Lưu ý: Filter này chỉ đang hoạt động trên danh sách của trang hiện tại (page hiện tại)
    const filteredUsers = users.filter((u) => {
        const keyword = search.toLowerCase();
        return (
            u.full_name?.toLowerCase().includes(keyword) ||
            u.email?.toLowerCase().includes(keyword) ||
            u.username?.toLowerCase().includes(keyword)
        );
    });

    // ================= HANDLE DELETE =================
    const handleDelete = async (user) => {
        const confirmDelete = window.confirm(
            `Bạn có chắc muốn khóa tài khoản "${user.username}"?`
        );

        if (!confirmDelete) return;

        try {
            await removeUser(user.id);
            // Không cần gọi fetchUsers ở đây nữa vì Context đã lo việc đó
            alert("Khóa tài khoản thành công");
        } catch (err) {
            alert("Khóa tài khoản thất bại");
        }
    };

    // ================= CHANGE PAGE =================
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setPage(page); // Đổi fetchUsers(page) thành setPage(page)
    };

    return (
        <div className="users-page">

            {/* HEADER */}
            <div className="header">
                <h1>Quản lý người dùng</h1>

                <button
                    className="invite-btn"
                    onClick={() => navigate("/admin/add-user")}
                >
                    + Thêm người dùng
                </button>
            </div>

            {/* STATS */}
            <div className="stats">
                <div className="card">
                    <span>TỔNG SỐ NGƯỜI DÙNG</span>
                    <h2>{pagination?.total || 0}</h2>
                </div>

                <div className="card">
                    <span>ĐANG HOẠT ĐỘNG</span>
                    <h2>{pagination?.totalActive || 0}</h2>
                </div>

                <div className="card">
                    <span>QUẢN TRỊ VIÊN</span>
                    <h2>{pagination?.totalAdmin || 0}</h2>
                </div>
            </div>

            {/* TABLE */}
            <div className="table-container">

                {/* SEARCH */}
                <div className="toolbar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                {/* LOADING */}
                {loading ? (
                    <p>Đang tải...</p>
                ) : userError ? ( // Cập nhật biến userError
                    <p>{userError}</p>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user, idx) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <Avatar name={user.full_name} idx={idx} />
                                                <div>
                                                    <div>{user.full_name}</div>
                                                    <div>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{user.username}</td>
                                        <td>{user.email}</td>

                                        <td>
                                            <span className={`role-badge ${user.role === 1 ? "role-admin" : "role-user"}`}>
                                                {user.role === 1 ? "ADMIN" : "USER"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`role-badge ${user.status === 1 ? "status-active" : "status-inactive"}`}>
                                                {user.status === 1 ? "ACTIVE" : "LOCKED"}
                                            </span>
                                        </td>

                                        <td>{user.created_at}</td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/edit-user/${user.id}`)
                                                }
                                            >
                                                <FiEdit2 />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(user)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        <div className="pagination">
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => goToPage(currentPage - 1)}
                            >
                                ← Trước
                            </button>

                            <span>
                                Trang {currentPage} / {totalPages}
                            </span>

                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => goToPage(currentPage + 1)}
                            >
                                Sau →
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}