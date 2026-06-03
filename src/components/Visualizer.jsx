//hiển thị trực quan thuật toán
import React from 'react';

function Visualizer() {
  // Dữ liệu mẫu (mock data)
  const array = [64, 34, 25, 12, 22, 11, 90];
  const maxVal = Math.max(...array);

  return (
    <div className="card">
      <h3 className="card-title">Khu vực mô phỏng</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '250px', gap: '8px', padding: '20px 0 0 0' }}>
        {array.map((value, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', marginBottom: '4px' }}>{value}</span>
            <div 
              style={{ 
                height: `${(value / maxVal) * 200}px`, 
                width: '40px', 
                backgroundColor: '#3182ce',
                borderRadius: '4px 4px 0 0'
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visualizer;