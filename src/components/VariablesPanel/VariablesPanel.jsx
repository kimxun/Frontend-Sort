import React, { useEffect, useMemo, useRef } from 'react';
import { useSorting } from '../../context/SortingContext';
import './VariablesPanel.css';

const VAR_COLORS = ["#a5b4fc", "#67e8f9", "#86efac", "#fbbf24", "#f9a8d4", "#c084fc"];

const VariablesPanel = () => {
  const { array, steps, currentStep } = useSorting();
  const activeVariableRef = useRef(null);

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
  const changedVariableNames = useMemo(() => {
    if (!safeSteps.length || currentStep <= 0) return new Set();

    const previousStep = safeSteps[currentStep - 1];
    const previousKeys = previousStep?.keys || [];
    const previousVals = previousStep?.vals || [];
    const previousMap = new Map(
      previousKeys.map((key, index) => [
        key,
        previousVals[index] !== undefined && previousVals[index] !== null ? String(previousVals[index]) : '-',
      ])
    );

    return new Set(
      dynamicVariables
        .filter((variable) => previousMap.get(variable.name) !== variable.value)
        .map((variable) => variable.name)
    );
  }, [currentStep, dynamicVariables, safeSteps]);
  const firstChangedVariableName = dynamicVariables.find((variable) =>
    changedVariableNames.has(variable.name)
  )?.name;

  useEffect(() => {
    if (!activeVariableRef.current) return;

    activeVariableRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  }, [currentStep, firstChangedVariableName]);

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
            {allVariables.map((v, i) => {
              const isChanged = changedVariableNames.has(v?.name);

              return (
              <div
                key={`${v?.name ?? 'variable'}-${i}`}
                ref={v?.name === firstChangedVariableName ? activeVariableRef : null}
                className={`variable-item ${isChanged ? 'changed' : ''}`}
              >
                <span className="variable-name" style={{ color: VAR_COLORS[i % VAR_COLORS.length] }}>
                  {v?.name ?? '?'}
                </span>
                <span className="variable-value">{v?.value ?? ''}</span>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariablesPanel;
