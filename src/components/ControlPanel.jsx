//cho phép chọn 1 trong 3 thuật toán: Interchange, Selection, hoặc Quick Sort.
import React from 'react';

function ControlPanel({ 
  selectedAlgoKey, 
  setSelectedAlgoKey, 
  setSteps, 
  setCurrentStep, 
  algoData, 
  inputVal, 
  setInputVal, 
  generateRandomArray, 
  startSorting, 
  currentStep, 
  steps 
}) {
  const buttonStyle = (bgColor) => ({
    width: '100%',
    padding: '12px',
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '12px'
  });

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#0f172a' }}>Sorting Controls</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: '600', fontSize: '14px', color: '#475569', display: 'block', marginBottom: '6px' }}>Choose Algorithm</label>
        <select 
          value={selectedAlgoKey} 
          onChange={(e) => { setSelectedAlgoKey(e.target.value); setSteps([]); setCurrentStep(-1); }}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '15px' }}
        >
          {Object.keys(algoData).map((key) => (
            <option key={key} value={key}>{algoData[key].title}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
          <span style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>Mảng số</span>
          <input 
            type="text" 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)}
            style={{ flex: 1, padding: '10px', border: 'none', outline: 'none', fontSize: '15px', textAlign: 'center' }}
          />
        </div>

        <button onClick={generateRandomArray} style={buttonStyle('#0f172a')}>Tạo Mảng Ngẫu Nhiên</button>
        <button onClick={startSorting} style={buttonStyle('#10b981')}>Bắt Đầu/Chạy Lại</button>
        <button onClick={() => { setSteps([]); setCurrentStep(-1); }} style={buttonStyle('#ef4444')}>Ngừng</button>
        <button 
          onClick={() => {
            if (currentStep < steps.length - 1) {
              const nextIdx = currentStep + 1;
              setCurrentStep(nextIdx);
            }
          }} 
          disabled={currentStep === -1 || currentStep === steps.length - 1}
          style={buttonStyle(currentStep === -1 || currentStep === steps.length - 1 ? '#cbd5e1' : '#10b981')}
        >
          Kế Tiếp ({currentStep + 1}/{steps.length})
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;