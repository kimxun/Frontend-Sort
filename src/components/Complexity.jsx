//Hiển thị độ phức tạp thuật toán
import React from 'react';

function Complexity({ currentComplexity }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Đánh Giá Giải Thuật (Độ Phức Tạp)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ backgroundColor: '#cbd5e1', color: '#0f172a' }}>
            <th style={{ padding: '10px', border: '1px solid #94a3b8' }}>Thời Gian (Time)</th>
            <th style={{ padding: '10px', border: '1px solid #94a3b8' }}>Không Gian (Space)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#334155' }}>
              Tốt nhất (Best Case): <strong>{currentComplexity.best}</strong><br/>
              Trung bình (Average Case): <strong>{currentComplexity.avg}</strong><br/>
              Tệ nhất (Worst Case): <strong>{currentComplexity.worst}</strong>
            </td>
            <td style={{ padding: '10px', border: '1px solid #cbd5e1', color: '#334155', verticalAlign: 'top' }}>
              Space: <strong>{currentComplexity.space}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Complexity;