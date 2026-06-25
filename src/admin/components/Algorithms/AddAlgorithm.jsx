import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './AddAlgorithm.css';

const AddAlgorithm = () => {
  const navigate = useNavigate();
  const { addAlgorithm, loading } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    code: '',
    description: '',
    steps: '',
    time_complexity: '',
    space_complexity: '',
    category_id: 1,
    status: 1,
  });
  const debounceTimer = useRef(null);

  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const generateSlug = (text) => {
    if (!text.trim()) return '';
    const noTone = removeVietnameseTones(text);
    return noTone
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }, 3500);
    return () => clearTimeout(debounceTimer.current);
  }, [formData.name]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepsArray = formData.steps.split('\n').filter(s => s.trim() !== '');
    const submitData = {
      ...formData,
      steps: stepsArray.length ? JSON.stringify(stepsArray) : null
    };
    try {
      await addAlgorithm(submitData);
      navigate('/admin/algorithms');
    } catch (err) {
    }
  };

  return (
    <div className="add-algorithm-page">
      <div className="breadcrumb">QUẢN LÝ › THUẬT TOÁN › THÊM MỚI</div>
      <div className="page-header">
        <h1>Thêm thuật toán</h1>
        <button type="button" className="close-btn" onClick={() => navigate('/admin/algorithms')}>✕</button>
      </div>
      <form className="add-algorithm-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Tên thuật toán</label>
            <input type="text" name="name" placeholder="e.g. Bubble Sort" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input type="text" name="slug" placeholder="Tự động từ tên" value={formData.slug} onChange={handleChange} required />
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
            <input type="text" name="time_complexity" placeholder="e.g. O(n^2)" value={formData.time_complexity} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Độ phức tạp bộ nhớ</label>
            <input type="text" name="space_complexity" placeholder="e.g. O(1)" value={formData.space_complexity} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Mã nguồn (Code)</label>
            <textarea name="code" placeholder="void bubbleSort(int arr[], int n) { ... }" value={formData.code} onChange={handleChange} rows="6" className="code-font" />
          </div>

          <div className="form-group full-width">
            <label>Mô tả</label>
            <textarea name="description" placeholder="Mô tả thuật toán" value={formData.description} onChange={handleChange} rows="3" />
          </div>

          <div className="form-group full-width">
            <label>Các bước thực hiện</label>
            <textarea name="steps" placeholder="Mỗi bước trên một dòng..." value={formData.steps} onChange={handleChange} rows="5" />
          </div>
        </div>
        
        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/algorithms')}>Hủy</button>
          <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Thêm thuật toán'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddAlgorithm;