import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './AlgorithmInfo.css';

const AlgorithmInfo = () => {
  const { algorithmInfo, loading } = useSorting();

  if (loading) {
    return (
      <div className="algorithm-info">
        Đang tải...
      </div>
    );
  }

  if (!algorithmInfo) {
    return (
      <div className="algorithm-info">
        Không có dữ liệu thuật toán
      </div>
    );
  }

  return (
    <div className="algorithm-info">
      <div className="algorithm-info-header">
        <div className="algorithm-info-header-content">
          <div>
            <div className="algorithm-info-name">
              {algorithmInfo.name}
            </div>

            <div className="algorithm-info-tagline">
              {algorithmInfo.slug}
            </div>
          </div>
        </div>
      </div>

      <div className="algorithm-info-body">
        <p className="algorithm-info-description">
          {algorithmInfo.description}
        </p>

        <div className="algorithm-info-badges">
          <div className="badge badge-time">
            <span className="badge-label">Time</span>
            <span className="badge-value">
              {algorithmInfo.time_complexity}
            </span>
          </div>

          <div className="badge badge-space">
            <span className="badge-label">Space</span>
            <span className="badge-value">
              {algorithmInfo.space_complexity}
            </span>
          </div>
        </div>

        {/* Các bước thực hiện */}
        {algorithmInfo.steps?.length > 0 && (
          <div className="algorithm-info-steps">
            <div className="steps-title">
              Các bước thực hiện:
            </div>

            <div className="steps-list">
              {algorithmInfo.steps?.map((step, index) => (
                <div className="step-item" key={index}>
                  <span className="step-number">
                    {index + 1}.
                  </span>

                  <span className="step-text">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmInfo;