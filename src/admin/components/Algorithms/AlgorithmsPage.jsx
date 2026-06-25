import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './AlgorithmsPage.css';
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const AlgorithmsPage = () => {
    const { 
        algorithms = [], 
        loading, 
        algorithmError, // Lấy state lỗi của thuật toán từ Context
        removeAlgorithm, 
        algorithmPagination,
        setAlgorithmPage // Sử dụng hàm set page thay vì fetch trực tiếp
    } = useAdmin();
    
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    
    const currentPage = algorithmPagination?.page || 1;
    const totalPages = algorithmPagination?.totalPages || 1;

    // Đã xóa useEffect fetchAlgorithms() ở đây vì Context đã tự động xử lý khi component mount

    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa thuật toán "${name}"?`)) {
            try {
                await removeAlgorithm(id);
                // Không cần gọi await fetchAlgorithms(currentPage) nữa
                alert('Xóa thành công');
            } catch (err) {
                alert('Xóa thất bại: ' + err.message);
            }
        }
    };

    const filtered = algorithms.filter(algo =>
        algo.name.toLowerCase().includes(search.toLowerCase()) ||
        algo.slug.toLowerCase().includes(search.toLowerCase())
    );

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setAlgorithmPage(page); // Gọi hàm đổi trang
    };

    return (
        <div className="algorithms-page">
            <div className="header">
                <h1>Quản lý thuật toán</h1>
                <button className="add-btn" onClick={() => navigate('/admin/add-algorithm')}>
                    + Thêm thuật toán
                </button>
            </div>

            <div className="table-container">
                <div className="toolbar">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thuật toán..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Xử lý hiển thị Loading và Error trực tiếp trong layout */}
                {loading ? (
                    <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>
                ) : algorithmError ? (
                    <div className="error" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                        {algorithmError}
                    </div>
                ) : (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Slug</th>
                                    <th>Độ phức tạp</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(algo => (
                                    <tr key={algo.id}>
                                        <td>{algo.id}</td>
                                        <td>{algo.name}</td>
                                        <td>{algo.slug}</td>
                                        <td>{algo.time_complexity}</td>
                                        <td>
                                            <span className={`status-badge ${algo.status === 1 ? 'active' : 'inactive'}`}>
                                                {algo.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => navigate(`/admin/edit-algorithm/${algo.id}`)}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(algo.id, algo.name)}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                            Không tìm thấy thuật toán nào.
                                        </td>
                                    </tr>
                                )}
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
};

export default AlgorithmsPage;