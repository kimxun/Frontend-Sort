import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './AddAlgorithm.css';

const AddAlgorithm = () => {
  const navigate = useNavigate();
  const { addAlgorithm, loading } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    time_complexity: '',
    space_complexity: '',
    category_id: 1,
    status: 1,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addAlgorithm(formData);
      alert('Thêm thuật toán thành công');
      navigate('/admin/algorithms');
    } catch (err) {
      setError(err.message || 'Không thể thêm thuật toán');
    }
  };

  return (
    <div className="add-algorithm-page">
      <div className="breadcrumb">QUẢN LÝ › THUẬT TOÁN › THÊM MỚI</div>
      <div className="page-header">
        <h1>Thêm thuật toán</h1>
        <button className="close-btn" onClick={() => navigate('/admin/algorithms')}>✕</button>
      </div>
      <form className="add-algorithm-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Tên thuật toán</label>
            <input type="text" name="name" placeholder="e.g. Bubble Sort" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input type="text" name="slug" placeholder="e.g. bubble-sort" value={formData.slug} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Mô tả</label>
            <input type="text" name="description" placeholder="Mô tả thuật toán" value={formData.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Độ phức tạp thời gian</label>
            <input type="text" name="time_complexity" placeholder="e.g. O(n^2)" value={formData.time_complexity} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Độ phức tạp bộ nhớ</label>
            <input type="text" name="space_complexity" placeholder="e.g. O(1)" value={formData.space_complexity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/algorithms')}>Hủy</button>
          <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Thêm thuật toán'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddAlgorithm;