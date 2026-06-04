import React from 'react';
import './Visualizer.css';

function Visualizer({ array }) {
  const maxVal = array.length > 0 ? Math.max(...array) : 100;

  return (
    <div className="card visualizer-card">
      <h3 className="card-title">Khu vực mô phỏng</h3>
      
      <div className="bars-container">
        {array.map((value, index) => {
          const barHeight = maxVal > 0 ? (value / maxVal) * 180 : 0;
          return (
            <div key={index} className="bar-wrapper">
              <span className="bar-value">{value}</span>
              <div 
                className="bar-element" 
                style={{ height: `${barHeight}px` }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Visualizer;