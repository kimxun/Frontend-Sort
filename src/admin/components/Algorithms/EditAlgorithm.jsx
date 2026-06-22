import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './AddAlgorithm.css';

const EditAlgorithm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { algorithms, editAlgorithm, loading } = useAdmin();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const algo = algorithms.find(a => a.id === parseInt(id));
    if (algo) {
      setFormData({
        name: algo.name || '',
        slug: algo.slug || '',
        code: algo.code || '',
        description: algo.description || '',
        steps: Array.isArray(algo.steps) ? algo.steps.join('\n') : '',
        time_complexity: algo.time_complexity || '',
        space_complexity: algo.space_complexity || '',
        category_id: algo.category_id || 1,
        status: algo.status !== undefined ? algo.status : 1,
      });
    }
  }, [algorithms, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const stepsArray = formData.steps.split('\n').filter(s => s.trim() !== '');
      const submitData = {
        ...formData,
        steps: stepsArray.length ? JSON.stringify(stepsArray) : null
      };
      await editAlgorithm(parseInt(id), submitData);
      alert('Cập nhật thành công');
      navigate('/admin/algorithms');
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại');
    }
  };

  if (!formData) return <div className="loading-state">Đang tải dữ liệu...</div>;

  return (
    <div className="add-algorithm-page">
      <div className="breadcrumb">QUẢN LÝ › THUẬT TOÁN › CHỈNH SỬA</div>
      <div className="page-header">
        <h1>Chỉnh sửa thuật toán</h1>
        <button type="button" className="close-btn" onClick={() => navigate('/admin/algorithms')}>✕</button>
      </div>
      <form className="add-algorithm-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Tên thuật toán</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Loại thuật toán</label>
            <select name="category_id" value={formData.category_id} onChange={handleChange}>
              <option value={1}>Sắp xếp</option>
              <option value={2}>Tìm kiếm</option>
            </select>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>

          <div className="form-group">
            <label>Độ phức tạp thời gian</label>
            <input type="text" name="time_complexity" value={formData.time_complexity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Độ phức tạp bộ nhớ</label>
            <input type="text" name="space_complexity" value={formData.space_complexity} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Mã nguồn (Code)</label>
            <textarea name="code" value={formData.code} onChange={handleChange} rows="6" className="code-font" />
          </div>

          <div className="form-group full-width">
            <label>Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group full-width">
            <label>Các bước thực hiện</label>
            <textarea name="steps" value={formData.steps} onChange={handleChange} rows="5" placeholder="Mỗi bước trên một dòng" />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/algorithms')}>Hủy</button>
          <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Cập nhật'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditAlgorithm;