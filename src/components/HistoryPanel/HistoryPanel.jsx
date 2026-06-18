import React, { useEffect, useRef } from 'react';
import { useSorting } from '../../context/SortingContext';
import './HistoryPanel.css';

const HistoryPanel = () => {
  const { steps } = useSorting();
  const scrollContainerRef = useRef(null);
  const safeHistory = Array.isArray(steps) ? steps : [];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [safeHistory.length]);

  return (
    <div className="history-panel">
      <div className="history-header">
        <span className="history-title">Lịch sử</span>
        {safeHistory.length > 0 && (
          <span className="history-badge">{safeHistory.length} bước</span>
        )}
      </div>
      <div ref={scrollContainerRef} className="history-content">
        {safeHistory.length === 0 ? (
          <div className="history-empty">Chưa có bước nào</div>
        ) : (
          <div className="history-steps">
            {safeHistory.map((array, i) => {
              const isLatest = i === safeHistory.length - 1;
              const arrayDisplay = Array.isArray(array) ? `[${array.join(", ")}]` : '[]';
              return (
                <div key={i} className={`history-item ${isLatest ? 'latest' : ''}`}>
                  <span className="history-step">Bước {i + 1}</span>
                  <div className="history-info">
                    <div className="history-array">{arrayDisplay}</div>
                  </div>
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