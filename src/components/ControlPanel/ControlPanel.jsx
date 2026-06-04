import React, { useState } from 'react';
import './ControlPanel.css';

function ControlPanel({ onRandom, onApplyCustom, onStart, onReset, onNextStep, isSorting }) {
  const [inputValue, setInputValue] = useState('');

  const handleApplyClick = () => {
    onApplyCustom(inputValue);
  };

  return (
    <div className="card control-panel-card">
      <div className="control-row row-1">
        <div className="input-group">
          <label className="input-label">Algorithm</label>
          <select className="custom-select" disabled={isSorting}>
            <option>Selection Sort</option>
            <option>Bubble Sort</option>
          </select>
        </div>

        <button 
          className="btn btn-start" 
          onClick={onStart} 
          disabled={isSorting}
          style={{ opacity: isSorting ? 0.6 : 1 }}
        >
          ▶ START
        </button>
        
        <button 
          className="btn btn-outline" 
          onClick={onReset} 
          disabled={isSorting}
          style={{ opacity: isSorting ? 0.6 : 1 }}
        >
          ↻ RESET
        </button>
        
        {/* Đã liên kết sự kiện click với hàm xử lý từng bước onNextStep */}
        <button 
          className="btn btn-outline" 
          onClick={onNextStep} 
          disabled={isSorting}
          style={{ opacity: isSorting ? 0.6 : 1 }}
        >
          ↑ TĂNG DẦN
        </button>

        <div className="slider-container">
          <span className="speed-icon">⏱</span>
          <input type="range" min="1" max="100" defaultValue="50" className="custom-slider" disabled={isSorting} />
        </div>
      </div>

      <div className="control-row row-2">
        <input 
          type="text" 
          placeholder="Nhập mảng (vd: 5, 2, 8, 1, 9)" 
          className="custom-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isSorting}
        />
        <button className="btn btn-apply" onClick={handleApplyClick} disabled={isSorting}>ÁP DỤNG</button>
        <button className="btn btn-random" onClick={onRandom} disabled={isSorting}>⤨ MẢNG NGẪU NHIÊN</button>
      </div>
    </div>
  );
}

export default ControlPanel;