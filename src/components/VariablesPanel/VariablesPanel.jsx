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

  const systemVariables = [
    { name: "Độ dài mảng", value: safeArray.length },
    { name: "Bước hiện tại", value: safeSteps.length > 0 ? `${currentStep + 1} / ${safeSteps.length}` : '0/0' },
  ];

  const backendKeys = currentStepData?.keys || [];
  const backendVals = currentStepData?.vals || [];

  const dynamicVariables = backendKeys.map((key, index) => ({
    name: key,
    value: backendVals[index] !== undefined && backendVals[index] !== null ? String(backendVals[index]) : '-'
  }));

  const allVariables = [...systemVariables, ...dynamicVariables];

  return (
    <div className="variables-panel">
      <div className="variables-header">
        <span className="variables-title">Biến trạng thái</span>
        {allVariables.length > 0 && (
          <span className="variables-badge">{allVariables.length}</span>
        )}
      </div>
      <div className="variables-content">
        {allVariables.length === 0 ? (
          <div className="variables-empty">Chưa có biến trạng thái nào</div>
        ) : (
          <div className="variables-grid">
            {allVariables.map((v, i) => (
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