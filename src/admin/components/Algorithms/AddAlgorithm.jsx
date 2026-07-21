import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { uploadAlgorithmCode } from '../../../services/algorithmService';
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

  const [uploadState, setUploadState] = useState({
    uploading: false,
    success: false,
    error: null,
    fileName: null,
    codeFilename: null,
    isCustom: false,
    hasDisplayCode: true,
    features: [],
  });
  const [formError, setFormError] = useState(null);
  const fileInputRef = useRef(null);
  const debounceTimer = useRef(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

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
    if (slugManuallyEdited) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.name),
      }));
    }, 3500);
    return () => clearTimeout(debounceTimer.current);
  }, [formData.name, slugManuallyEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'slug') setSlugManuallyEdited(true);
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let slugToSend = formData.slug.trim();
    if (!slugToSend && formData.name.trim()) {
      slugToSend = generateSlug(formData.name);
      setFormData(prev => ({ ...prev, slug: slugToSend }));
      setSlugManuallyEdited(false);
    } else if (!slugToSend) {
      alert('Vui lòng nhập tên thuật toán trước khi chọn file.');
      e.target.value = '';
      return;
    }

    if (!file.name.endsWith('.py')) {
      setUploadState({
        uploading: false,
        success: false,
        error: 'Chỉ chấp nhận file .py',
        fileName: file.name,
        codeFilename: null,
        isCustom: false,
        hasDisplayCode: true,
        features: [],
      });
      e.target.value = '';
      return;
    }

    if (file.size > 200 * 1024) {
      setUploadState({
        uploading: false,
        success: false,
        error: 'File vượt quá 200KB. Kiểm tra lại thuật toán có bị lặp không cần thiết.',
        fileName: file.name,
        codeFilename: null,
        isCustom: false,
        hasDisplayCode: true,
        features: [],
      });
      e.target.value = '';
      return;
    }

    handleUpload(file, slugToSend);
  };

  const handleUpload = async (file, slug) => {
    setUploadState({
      uploading: true,
      success: false,
      error: null,
      fileName: file.name,
      codeFilename: null,
      isCustom: false,
      hasDisplayCode: true,
      features: [],
    });

    try {
      const result = await uploadAlgorithmCode(file, slug);
      const hasDisplay = result.display_code && result.display_code.trim() !== '';
      setUploadState({
        uploading: false,
        success: true,
        error: null,
        fileName: file.name,
        codeFilename: result.code_filename,
        isCustom: true,
        hasDisplayCode: hasDisplay,
        features: result.features || [],
      });
      setSlugManuallyEdited(false);

      setFormData((prev) => ({
        ...prev,
        code: hasDisplay ? result.display_code : '',
        time_complexity: result.time_complexity || prev.time_complexity,
        space_complexity: result.space_complexity || prev.space_complexity,
        description: result.description || prev.description,
        steps: Array.isArray(result.steps) ? result.steps.join('\n') : prev.steps,
      }));
    } catch (err) {
      const errMsg =
        err?.response?.data?.error ||
        'Upload thất bại. Kiểm tra lại định dạng file theo template.';
      setUploadState({
        uploading: false,
        success: false,
        error: errMsg,
        fileName: file.name,
        codeFilename: null,
        isCustom: false,
        hasDisplayCode: true,
        features: [],
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadState({
      uploading: false,
      success: false,
      error: null,
      fileName: null,
      codeFilename: null,
      isCustom: false,
      hasDisplayCode: true,
      features: [],
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSlugManuallyEdited(false);
    setFormData(prev => ({ ...prev, code: '', time_complexity: '', space_complexity: '', description: '', steps: '' }));
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
    setFormError(null);

    if (uploadState.uploading) return;
    if (uploadState.fileName && !uploadState.success) {
      setFormError('File thuật toán chưa hợp lệ. Vui lòng chọn file khác hoặc bấm "Xoá" trước khi lưu.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Vui lòng nhập mô tả thuật toán.');
      return;
    }

    const stepsArray = formData.steps.split('\n').filter((s) => s.trim() !== '');
    if (stepsArray.length === 0) {
      setFormError('Vui lòng nhập ít nhất một bước thực hiện.');
      return;
    }

    const submitData = {
      ...formData,
      steps: JSON.stringify(stepsArray),
      is_custom: uploadState.isCustom,
      code_filename: uploadState.codeFilename,
      features: uploadState.features,
    };

    try {
      await addAlgorithm(submitData);
      navigate('/admin/algorithms');
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.message ||
        'Thêm thuật toán thất bại. Vui lòng thử lại.';
      setFormError(message);
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
        {formError && (
          <div
            className="status-badge status-error"
            style={{ display: 'block', marginBottom: '16px', padding: '10px 12px' }}
          >
            ✕ {formError}
          </div>
        )}
        <div className="form-grid">
          <div className="form-group">
            <label>Tên thuật toán</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Bubble Sort"
              value={formData.name}
              onChange={handleChange}
              required
              onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập tên thuật toán.')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              placeholder="Tự động từ tên"
              value={formData.slug}
              onChange={handleChange}
            />
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
            <label>File thuật toán (.py) — upload để chạy được mô phỏng</label>

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
                  {uploadState.fileName ? 'Chọn file khác' : 'Chọn file .py'}
                </label>
                <button type="button" className="template-btn" onClick={handleDownloadTemplate}>
                  ⬇ Tải template mẫu
                </button>
              </div>

              {uploadState.fileName && (
                <div className="upload-status">
                  <span className="file-name">📄 {uploadState.fileName}</span>

                  {uploadState.uploading && (
                    <span className="status-badge status-checking">Đang kiểm tra...</span>
                  )}

                  {uploadState.success && (
                    <span className="status-badge status-success">
                      ✓ Hợp lệ — slug: {formData.slug}
                      {!uploadState.hasDisplayCode && (
                        <span style={{ marginLeft: 8, color: '#fbbf24' }}>⚠ Thiếu DISPLAY_CODE</span>
                      )}
                    </span>
                  )}

                  {uploadState.error && (
                    <span className="status-badge status-error">✕ {uploadState.error}</span>
                  )}

                  <button type="button" className="remove-file-btn" onClick={handleRemoveFile}>
                    Xoá
                  </button>
                </div>
              )}

              <p className="upload-hint">
                File phải có hàm <code>run_logic(arr, sort_order="asc")</code> đúng theo template,
                trả về đúng 5 giá trị và mỗi bước phải đủ các trường bắt buộc. Hệ thống sẽ tự động
                kiểm tra an toàn (chặn import nguy hiểm, chặn vòng lặp vô hạn) và chạy thử trước khi lưu.
              </p>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Mã nguồn (Code) — xem trước / chỉnh sửa hiển thị</label>
            <textarea
              name="code"
              placeholder="void bubbleSort(int arr[], int n) { ... }"
              value={formData.code}
              onChange={handleChange}
              rows="8"
              className="code-font"
            />
          </div>

          <div className="form-group full-width">
            <label>Mô tả <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              name="description"
              placeholder="Mô tả thuật toán"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập mô tả thuật toán.')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>

          <div className="form-group full-width">
            <label>Các bước thực hiện <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              name="steps"
              placeholder="Mỗi bước trên một dòng..."
              value={formData.steps}
              onChange={handleChange}
              rows="5"
              required
              onInvalid={(e) => e.target.setCustomValidity('Vui lòng nhập các bước thực hiện.')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
          </div>
        </div>

        <div className="button-group">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/algorithms')}>Hủy</button>
          <button
            type="submit"
            className="save-btn"
            disabled={loading || uploadState.uploading || (uploadState.fileName && !uploadState.success)}
          >
            {loading ? 'Đang xử lý...' : 'Thêm thuật toán'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlgorithm;