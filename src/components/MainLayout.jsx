// src/components/MainLayout.jsx
import React from 'react';
import ControlPanel from './ControlPanel'; // vẫn giữ nguyên vì nó là phần cố định của layout

function MainLayout({ leftContent, rightContent }) {
  return (
    <div className="app-container">
      <h1 className="header-title">SORTING ALGORITHM VISUALIZER</h1>

      {/* Khu vực điều khiển – cố định */}
      <ControlPanel />

      <div className="main-content">
        {/* Cột trái: nhận nội dung từ bên ngoài */}
        <div className="left-column">
          {leftContent}
        </div>

        {/* Cột phải: nhận nội dung từ bên ngoài */}
        <div>
          {rightContent}
        </div>
      </div>

      {/* Lịch sử thực hiện – cố định */}
      <div className="card history-section">
        <h3 className="card-title">Lịch sử thực hiện</h3>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>Chưa có bước nào</p>
      </div>
    </div>
  );
}

export default MainLayout;