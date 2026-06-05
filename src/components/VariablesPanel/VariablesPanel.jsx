import React from 'react';
import './VariablesPanel.css';

const VAR_COLORS = ["#a5b4fc", "#67e8f9", "#86efac", "#fbbf24", "#f9a8d4", "#c084fc"];

const VariablesPanel = ({ variables }) => {
  // Kiểm tra biến variables có phải mảng không, nếu không gán mảng rỗng
  const safeVariables = Array.isArray(variables) ? variables : [];

  return (
    <div className="variables-panel">
      <div className="variables-header">
        <span className="variables-title">Biến trạng thái</span>
        {safeVariables.length > 0 && (
          <span className="variables-badge">{safeVariables.length}</span>
        )}
      </div>

      <div className="variables-content">
        {safeVariables.length === 0 ? (
          <div className="variables-empty">Chưa có biến nào</div>
        ) : (
          <div className="variables-grid">
            {safeVariables.map((v, i) => (
              <div key={i} className="variable-item">
                <span className="variable-name" style={{ color: VAR_COLORS[i % VAR_COLORS.length] }}>
                  {v?.name ?? '?'}
                </span>
                <span className="variable-value">{v?.value ?? ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariablesPanel;