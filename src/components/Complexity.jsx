//Hiển thị độ phức tạp thuật toán
import React from 'react';

function Complexity() {
  return (
    <div className="card" style={{ height: '100%' }}>
      <h3 style={{ color: '#3182ce', marginBottom: '10px' }}>Selection Sort</h3>
      <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.5' }}>
        Thuật toán sắp xếp chọn (Selection Sort) tìm phần tử nhỏ nhất trong mảng chưa sắp xếp và đưa nó vào vị trí đúng.
      </p>

      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Độ phức tạp:</h4>
      <ul style={{ fontSize: '0.9rem', color: '#4a5568', listStyle: 'none', padding: 0 }}>
        <li>Thời gian: O(n²)</li>
        <li>Không gian: O(1)</li>
      </ul>

      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Các bước thực hiện:</h4>
      <ol style={{ fontSize: '0.9rem', color: '#4a5568', paddingLeft: '20px', lineHeight: '1.6' }}>
        <li>Tìm phần tử nhỏ nhất trong mảng chưa sắp xếp</li>
        <li>Hoán đổi phần tử nhỏ nhất với phần tử đầu tiên</li>
        <li>Lặp lại cho phần còn lại của mảng</li>
      </ol>

      <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Biến trạng thái</h4>
      <p style={{ fontSize: '0.9rem', color: '#a0aec0' }}>Chưa có biến nào</p>
    </div>
  );
}

export default Complexity;