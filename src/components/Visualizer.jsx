//hiển thị trực quan thuật toán
import React from 'react';

function Visualizer({ array, activeComparing, currentStep, stepDescription }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#0f172a' }}>Sorting Array Visualization</h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: '320px', gap: '24px', padding: '20px 0', borderBottom: '1px solid #f1f5f9' }}>
        {array.map((value, idx) => {
          const isComparing = activeComparing.includes(idx);
          let barColor = '#0f172a'; 
          if (isComparing) {
            barColor = activeComparing[0] === idx ? '#f97316' : '#eab308';
          }

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '50px' }}>
              <div style={{
                width: '100%',
                height: `${value * 28}px`,
                backgroundColor: barColor,
                borderRadius: '6px',
                transition: 'height 0.3s, background-color 0.3s'
              }}></div>
              <span style={{ marginTop: '12px', fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>{value}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#475569', fontSize: '14px', textTransform: 'uppercase' }}>Các Bước Thực Hiện</h4>
        <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', height: '100px', overflowY: 'auto', fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
          <strong>Bước {currentStep + 1}:</strong> {stepDescription}
        </div>
      </div>
    </div>
  );
}

export default Visualizer;