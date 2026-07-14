import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { toast } from 'react-toastify';
import { getAlgorithmById, uploadAlgorithmCode } from '../../../services/algorithmService';
import './AddAlgorithm.css';

const EditAlgorithm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editAlgorithm, loading } = useAdmin();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const debounceTimer = useRef(null);
  const hasIdentifiedInitialName = useRef(false);
  const fileInputRef = useRef(null);

  const [uploadState, setUploadState] = useState({
    uploading: false,
    success: false,
    error: null,
    fileName: null,
    codeFilename: null,
    isCustom: false,
    hasDisplayCode: true,
    features: [],
    initialCodeFilename: null,
    initialIsCustom: false,
  });

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
    const fetchAlgorithm = async () => {
      try {
        const data = await getAlgorithmById(parseInt(id));
        if (data) {
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            code: data.code || '',
            description: data.description || '',
            steps: Array.isArray(data.steps) ? data.steps.join('\n') : (data.steps || ''),
            time_complexity: data.time_complexity || '',
            space_complexity: data.space_complexity || '',
            category_id: data.category_id || 1,
            status: data.status !== undefined ? data.status : 1,
          });
          setUploadState(prev => ({
            ...prev,
            success: true,
            codeFilename: data.code_filename || null,
            isCustom: data.is_custom || false,
            features: Array.isArray(data.features) ? data.features : [],
            initialCodeFilename: data.code_filename || null,
            initialIsCustom: data.is_custom || false,
            fileName: data.code_filename || null,
          }));
        }
      } catch (err) {
        toast.error('Không thể tải thông tin thuật toán');
      }
    };
    fetchAlgorithm();
  }, [id]);

  useEffect(() => {
    if (!formData) return;

    if (!hasIdentifiedInitialName.current) {
      hasIdentifiedInitialName.current = true;
      return;
    }

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }, 800);

    return () => clearTimeout(debounceTimer.current);
  }, [formData?.name]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        success: false,
        error: 'Chỉ chấp nhận file .py',
        fileName: null,
        codeFilename: prev.initialCodeFilename,
      }));
      e.target.value = '';
      return;
    }

    if (file.size > 200 * 1024) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        success: false,
        error: 'File vượt quá 200KB.',
        fileName: null,
        codeFilename: prev.initialCodeFilename,
      }));
      e.target.value = '';
      return;
    }

    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploadState(prev => ({
      ...prev,
      uploading: true,
      success: false,
      error: null,
      fileName: file.name,
      codeFilename: null,
    }));

    try {
      const result = await uploadAlgorithmCode(file);
      const hasDisplay = result.display_code && result.display_code.trim() !== '';
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        success: true,
        error: null,
        fileName: file.name,
        codeFilename: result.code_filename,
        isCustom: true,
        hasDisplayCode: hasDisplay,
        features: result.features || [],
      }));

      if (hasDisplay) {
        setFormData(prev => ({ ...prev, code: result.display_code }));
      }
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Upload thất bại.';
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        success: false,
        error: errMsg,
        fileName: file.name,
        codeFilename: prev.initialCodeFilename,
      }));
    }
  };

  const handleRemoveFile = () => {
    setUploadState(prev => ({
      ...prev,
      uploading: false,
      success: false,
      error: null,
      fileName: null,
      codeFilename: null,
      isCustom: false,
      hasDisplayCode: true,
      features: [],
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData(prev => ({ ...prev, code: '' }));
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/templates/algorithm_template.py';
    link.download = 'algorithm_template.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (uploadState.uploading) return;
    if (uploadState.fileName && !uploadState.success) return;

    const stepsArray = formData.steps.split('\n').filter(s => s.trim() !== '');
    const submitData = {
      ...formData,
      steps: stepsArray.length ? JSON.stringify(stepsArray) : null,
      is_custom: uploadState.isCustom,
      code_filename: uploadState.codeFilename,
      features: uploadState.features,
    };

    try {
      await editAlgorithm(parseInt(id), submitData);
      toast.success('Cập nhật thành công!');
      navigate('/admin/algorithms');
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Cập nhật thất bại';
      toast.error(message);
      setError(message);
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
            <label>File thuật toán (.py) — tải lên để chạy mô phỏng</label>
            <div className="upload-box">
              <div className="upload-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".py"
                  onChange={handleFileSelect}
                  disabled={uploadState.uploading}
                  id="algo-file-input"
                  style={{ display: 'none' }}
                />
                <label htmlFor="algo-file-input" className="upload-select-btn">
                  {uploadState.fileName ? 'Chọn file khác' : (uploadState.initialCodeFilename ? 'Thay đổi file' : 'Chọn file .py')}
                </label>
                <button type="button" className="template-btn" onClick={handleDownloadTemplate}>
                  ⬇ Tải template mẫu
                </button>
              </div>

              {(uploadState.fileName || uploadState.initialCodeFilename) && (
                <div className="upload-status">
                  <span className="file-name">
                    📄 {uploadState.fileName || uploadState.initialCodeFilename}
                  </span>

                  {uploadState.uploading && (
                    <span className="status-badge status-checking">Đang kiểm tra...</span>
                  )}

                  {uploadState.success && !uploadState.uploading && (
                    <span className="status-badge status-success">
                      ✓ Hợp lệ
                      {!uploadState.hasDisplayCode && (
                        <span style={{ marginLeft: 8, color: '#fbbf24' }}>⚠ Thiếu DISPLAY_CODE</span>
                      )}
                    </span>
                  )}

                  {uploadState.error && (
                    <span className="status-badge status-error">✕ {uploadState.error}</span>
                  )}

                  {uploadState.initialCodeFilename && !uploadState.fileName && (
                    <span className="status-badge status-success">✓ Đã có file</span>
                  )}

                  <button type="button" className="remove-file-btn" onClick={handleRemoveFile}>
                    Xoá
                  </button>
                </div>
              )}

              <p className="upload-hint">
                File phải có hàm <code>run_logic(arr, sort_order="asc")</code> đúng theo template,
                trả về đúng 5 giá trị và mỗi bước phải đủ các trường bắt buộc. Hệ thống sẽ tự động
                kiểm tra an toàn và chạy thử trước khi lưu.
              </p>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Mã nguồn (Code) — xem trước / chỉnh sửa hiển thị</label>
            <textarea name="code" value={formData.code} onChange={handleChange} rows="8" className="code-font" />
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
          <button
            type="submit"
            className="save-btn"
            disabled={loading || uploadState.uploading || (uploadState.fileName && !uploadState.success)}
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlgorithm;