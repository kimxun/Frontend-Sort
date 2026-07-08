import { useState } from "react";
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
        userError,
        removeUser,
        pagination,
        setPage,
    } = useAdmin();

    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;

    const filteredUsers = users.filter((u) => {
        const keyword = search.toLowerCase();
        return (
            u.full_name?.toLowerCase().includes(keyword) ||
            u.email?.toLowerCase().includes(keyword) ||
            u.username?.toLowerCase().includes(keyword)
        );
    });

    const handleSoftDelete = async () => {
        if (!deleteTarget) return;
        try {
            await removeUser(deleteTarget.id, { type: "soft" });
        } catch {
            return;
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleHardDelete = async () => {
        if (!deleteTarget) return;
        try {
            await removeUser(deleteTarget.id, { type: "hard" });
        } catch {
            return;
        } finally {
            setDeleteTarget(null);
        }
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setPage(page);
    };

    return (
        <div className="users-page">
            <div className="header">
                <h1>QUẢN LÝ NGƯỜI DÙNG</h1>

                <button
                    className="invite-btn"
                    onClick={() => navigate("/admin/add-user")}
                >
                    + Thêm người dùng
                </button>
            </div>

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

            <div className="table-container">
                <div className="toolbar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Đang tải...</p>
                ) : userError ? (
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
                                                onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                            >
                                                <FiEdit2 />
                                            </button>

                                            <button
                                                onClick={() => setDeleteTarget(user)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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

            {deleteTarget && (
                <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="modal-content" onClick={(event) => event.stopPropagation()}>
                        <h3>Xóa người dùng</h3>
                        <p>
                            Bạn muốn xóa tài khoản <strong>{deleteTarget.username}</strong> theo cách nào?
                        </p>
                        <div className="modal-buttons">
                            <button className="btn btn-warning" onClick={handleSoftDelete}>
                                Xóa mềm (khóa tài khoản)
                            </button>
                            <button className="btn btn-danger" onClick={handleHardDelete}>
                                Xóa cứng (xóa vĩnh viễn)
                            </button>
                            <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
