import React, { useEffect, useRef } from 'react';
import './HistoryPanel.css';

const HistoryPanel = ({ history }) => {
  const scrollContainerRef = useRef(null);
  const safeHistory = Array.isArray(history) ? history : [];

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
      <div ref={scrollContainerRef} className="history-list">
        {safeHistory.length === 0 ? (
          <div className="history-empty">Chưa có bước nào</div>
        ) : (
          <div className="history-steps">
            {safeHistory.map((item, i) => {
              const isLatest = i === safeHistory.length - 1;
              const arrayDisplay = item?.array && Array.isArray(item.array) 
                ? `[${item.array.join(", ")}]` 
                : '[]';
              return (
                <div key={i} className={`history-item ${isLatest ? 'latest' : ''}`}>
                  <span className="history-step-number">#{item?.step ?? i+1}</span>
                  <div className="history-content">
                    <div className="history-description">{item?.description ?? ''}</div>
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