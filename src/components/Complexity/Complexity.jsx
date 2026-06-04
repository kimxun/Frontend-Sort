import React from 'react';
import './Complexity.css';

function Complexity() {
  return (
    <div className="card complexity-card">
      <h3 className="complexity-title">Selection Sort</h3>
      <p className="complexity-text">
        Thuật toán sắp xếp chọn (Selection Sort) tìm phần tử nhỏ nhất trong mảng chưa sắp xếp và đưa nó vào vị trí đúng.
      </p>

      <h4 className="complexity-subtitle">Độ phức tạp:</h4>
      <ul className="complexity-list">
        <li>Thời gian: O(n²)</li>
        <li>Không gian: O(1)</li>
      </ul>

      <h4 className="complexity-subtitle">Các bước thực hiện:</h4>
      <ol className="complexity-list ordered">
        <li>Tìm phần tử nhỏ nhất trong mảng chưa sắp xếp</li>
        <li>Hoán đổi phần tử nhỏ nhất với phần tử đầu tiên</li>
        <li>Lặp lại cho phần còn lại của mảng</li>
      </ol>

      <h4 className="complexity-subtitle">Biến trạng thái</h4>
      <p className="status-placeholder">Chưa có biến nào</p>
    </div>
  );
}

export default Complexity;