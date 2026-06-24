import React, { useEffect, useRef } from 'react';
import { useSorting } from '../../context/SortingContext';
import './HistoryPanel.css';

const HistoryPanel = () => {
  const { steps, currentStep, setCurrentStep, setArray } = useSorting();
  const scrollContainerRef = useRef(null);
  const safeHistory = Array.isArray(steps) ? steps : [];

  const visibleSteps = safeHistory.slice(0, currentStep + 1);

useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleSteps.length]);

  const handleStepClick = (index) => {
    setCurrentStep(index);
    if (safeHistory[index]?.array) {
      setArray(safeHistory[index].array);
    }
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <span className="history-title">Lịch sử thao tác</span>
        {visibleSteps.length > 0 && (
          <span className="history-badge">{visibleSteps.length} bước</span>
        )}
      </div>

      <div ref={scrollContainerRef} className="history-content">
        {visibleSteps.length === 0 ? (
          <div className="history-empty">Chưa có bước nào được thực thi</div>
        ) : (
          <div className="history-steps">
            {visibleSteps.map((stepObj, i) => {
              const isActive = i === currentStep;
              const stepArray = stepObj?.array || [];
              const arrayDisplay = `[${stepArray.join(", ")}]`;
              const actionDisplay = stepObj?.action || "Đang xử lý...";

              return (
                <div 
                  key={i} 
                  className={`history-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleStepClick(i)}
                >
                  <div className="history-item-top">
                    <span className="history-step">Bước {i + 1}</span>
                    <span className="history-array">{arrayDisplay}</span>
                  </div>
                  <div className="history-action-text">{actionDisplay}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;