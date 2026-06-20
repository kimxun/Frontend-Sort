import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './VariablesPanel.css';

const VAR_COLORS = ["#a5b4fc", "#67e8f9", "#86efac", "#fbbf24", "#f9a8d4", "#c084fc"];

const VariablesPanel = () => {
  const { array, steps, currentStep } = useSorting();

  const safeSteps = Array.isArray(steps) ? steps : [];
  const currentStepData = safeSteps.length > 0 && currentStep < safeSteps.length
    ? safeSteps[currentStep]
    : null;

  const currentArray = currentStepData?.array || array;
  const safeArray = Array.isArray(currentArray) ? currentArray : [];

  const variables = [
    { name: "Độ dài mảng", value: safeArray.length },
    { name: "Bước hiện tại", value: `${Math.min(currentStep + 1, safeSteps.length)} / ${safeSteps.length || 1}` },
    { name: "Mảng", value: safeArray.length ? `[${safeArray.join(", ")}]` : "[]" },
    { name: "Số bước", value: safeSteps.length },
    { name: "Phần tử nhỏ nhất", value: safeArray.length ? Math.min(...safeArray) : '-' },
    { name: "Phần tử lớn nhất", value: safeArray.length ? Math.max(...safeArray) : '-' },
  ];

  return (
    <div className="variables-panel">
      <div className="variables-header">
        <span className="variables-title">Biến trạng thái</span>
        {variables.length > 0 && (
          <span className="variables-badge">{variables.length}</span>
        )}
      </div>
      <div className="variables-content">
        {variables.length === 0 ? (
          <div className="variables-empty">Chưa có biến nào</div>
        ) : (
          <div className="variables-grid">
            {variables.map((v, i) => (
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