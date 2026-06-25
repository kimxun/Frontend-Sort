import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './SortingVisualizer.css';

const BAR_COLORS = {
  default:   { bg: "#3b82f6", glow: "0 0 12px rgba(59,130,246,0.5)" },
  comparing: { bg: "#f59e0b", glow: "0 0 14px rgba(245,158,11,0.6)" },
  swapping:  { bg: "#ef4444", glow: "0 0 14px rgba(239,68,68,0.6)" },
  current:   { bg: "#a855f7", glow: "0 0 14px rgba(168,85,247,0.6)" },
  sorted:    { bg: "#10b981", glow: "0 0 12px rgba(16,185,129,0.4)" },
};

const LEGEND = [
  { id: "default", color: BAR_COLORS.default.bg, label: "Chưa xử lý" },
  { id: "comparing", color: BAR_COLORS.comparing.bg, label: "Đang so sánh" },
  { id: "swapping", color: BAR_COLORS.swapping.bg, label: "Đang hoán đổi" },
  { id: "pivot", color: BAR_COLORS.current.bg, label: "Phần tử chốt" },
  { id: "sorted", color: BAR_COLORS.sorted.bg, label: "Đã sắp xếp" },
];

const getBarColor = (index, stepData) => {
  if (!stepData) return BAR_COLORS.default;
  
  const { comparing = [], swapping = [], pivot, sorted = [] } = stepData;
  
  if (swapping.includes(index)) return BAR_COLORS.swapping;
  if (comparing.includes(index)) return BAR_COLORS.comparing;
  if (pivot === index) return BAR_COLORS.current;
  if (sorted.includes(index)) return BAR_COLORS.sorted;
  
  return BAR_COLORS.default;
};

const SortingVisualizer = () => {
  const { steps, currentStep, array, algorithmInfo } = useSorting();

  const currentStepData = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep]
    : null;

  const currentArray = currentStepData?.array || array;
  const safeArray = Array.isArray(currentArray) ? currentArray : [];
  const maxValue = safeArray.length > 0 ? Math.max(...safeArray, 1) : 1;

  const currentSlug = algorithmInfo?.slug || '';
  const filteredLegend = LEGEND.filter(item => {
    if (item.id === 'pivot') {
      return currentSlug === 'quick-sort';
    }
    return true;
  });

  return (
    <div className="visualizer-container">
      <div className="legend-container">
        {filteredLegend.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-color" style={{ background: item.color }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="bars-container">
        {safeArray.map((value, index) => {
          const heightPct = (value / maxValue) * 100;
          const barHeight = Math.max(heightPct * 2, 20);
          const colorScheme = getBarColor(index, currentStepData);

          return (
            <div key={`bar-${index}`} className="bar-wrapper">
              <span className="bar-value">{value}</span>
              <div
                className="bar"
                style={{
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${colorScheme.bg}ee, ${colorScheme.bg}99)`,
                  boxShadow: colorScheme.glow,
                }}
              />
              <span className="bar-index">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SortingVisualizer;