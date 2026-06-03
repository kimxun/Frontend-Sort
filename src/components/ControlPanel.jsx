//cho phép chọn 1 trong 3 thuật toán: Interchange, Selection, hoặc Quick Sort.
import React from 'react';

function ControlPanel() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '0.8rem', color: '#718096' }}>Algorithm</label>
          <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}>
            <option>Selection Sort</option>
            <option>Bubble Sort</option>
          </select>
        </div>

        <button style={{ padding: '8px 16px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', marginTop: '16px', cursor: 'pointer' }}>
          ▶ START
        </button>
        <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e0', borderRadius: '4px', marginTop: '16px', cursor: 'pointer' }}>
          ↻ RESET
        </button>
        <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e0', borderRadius: '4px', marginTop: '16px', cursor: 'pointer' }}>
          ↑ TĂNG DẦN
        </button>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center' }}>
          <input type="range" min="1" max="100" defaultValue="50" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nhập mảng (vd: 5, 2, 8, 1, 9)" 
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #cbd5e0' }}
        />
        <button style={{ padding: '8px 16px', background: '#edf2f7', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer' }}>
          ÁP DỤNG
        </button>
        <button style={{ padding: '8px 16px', background: 'white', color: '#805ad5', border: '1px solid #d6bcfa', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⤨ MẢNG NGẪU NHIÊN
        </button>
      </div>

    </div>
  );
}

export default ControlPanel;