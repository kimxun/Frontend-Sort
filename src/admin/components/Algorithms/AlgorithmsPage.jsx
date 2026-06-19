import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './AlgorithmsPage.css';

const AlgorithmsPage = () => {
    const { algorithms, fetchAlgorithms, loading, removeAlgorithm } = useAdmin();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlgorithms();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc muốn xóa thuật toán "${name}"?`)) {
            try {
                await removeAlgorithm(id);
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

    if (loading) return <div className="loading">Đang tải...</div>;

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
                                        Sửa
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDelete(algo.id, algo.name)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AlgorithmsPage;