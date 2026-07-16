import React from 'react';
import { useSorting } from '../../context/SortingContext';
import './SortingVisualizer.css';

const BAR_COLORS = {
  default:   { bg: "#3b82f6", glow: "0 0 12px rgba(59,130,246,0.5)" },
  comparing: { bg: "#f59e0b", glow: "0 0 14px rgba(245,158,11,0.6)" },
  swapping:  { bg: "#ef4444", glow: "0 0 14px rgba(239,68,68,0.6)" },
  candidate: { bg: "#ec4899", glow: "0 0 14px rgba(236,72,153,0.6)" },
  current:   { bg: "#a855f7", glow: "0 0 14px rgba(168,85,247,0.6)" },
  sorted:    { bg: "#10b981", glow: "0 0 12px rgba(16,185,129,0.4)" },
  found:     { bg: "#22c55e", glow: "0 0 14px rgba(34,197,94,0.6)" },
  discarded: { bg: "#6b7280", glow: "0 0 10px rgba(107,114,128,0.35)" },
  waiting:   { bg: "#6b7280", glow: "0 0 10px rgba(107,114,128,0.35)" },
};

const LEGEND = [
  { id: "default", color: BAR_COLORS.default.bg, label: "Chưa xử lý" },
  { id: "comparing", color: BAR_COLORS.comparing.bg, label: "Đang so sánh" },
  { id: "swapping", color: BAR_COLORS.swapping.bg, label: "Đang hoán đổi" },
  { id: "candidate", color: BAR_COLORS.candidate.bg, label: "Ứng viên tạm thời" },
  { id: "pivot", color: BAR_COLORS.current.bg, label: "Phần tử chốt" },
  { id: "sorted", color: BAR_COLORS.sorted.bg, label: "Đã sắp xếp" },
  { id: "found", color: BAR_COLORS.found.bg, label: "Đã tìm thấy" },
  { id: "discarded", color: BAR_COLORS.discarded.bg, label: "Bị loại" },
  { id: "waiting", color: BAR_COLORS.waiting.bg, label: "Chưa đụng tới" },
];

const getBarColor = (index, stepData, isSearchMode) => {
  if (!stepData) return BAR_COLORS.default;

  if (isSearchMode) {
    const foundIndex = stepData.current_index ?? stepData.mid;

    if (stepData.found && foundIndex === index) return BAR_COLORS.found;
    if (stepData.comparing?.includes(index)) return BAR_COLORS.comparing;
    if (stepData.discarded?.includes(index)) return BAR_COLORS.discarded;
    return BAR_COLORS.default;
  }

  const { comparing = [], swapping = [], candidate, pivot, sorted = [], waiting = [] } = stepData;

  if (swapping.includes(index)) return BAR_COLORS.swapping;
  if (candidate === index) return BAR_COLORS.candidate;
  if (comparing.includes(index)) return BAR_COLORS.comparing;
  if (pivot === index) return BAR_COLORS.current;
  if (sorted.includes(index)) return BAR_COLORS.sorted;
  if (waiting.includes(index)) return BAR_COLORS.waiting;

  return BAR_COLORS.default;
};

const SortingVisualizer = () => {
  const { steps, currentStep, array, algorithmInfo, sortOrder } = useSorting();

  const isSearchMode =
    algorithmInfo?.slug === "linear-search" ||
    algorithmInfo?.slug === "binary-search";
  const currentStepData = steps.length > 0 && currentStep < steps.length
    ? steps[currentStep]
    : null;
  const stepStatus =
    currentStepData?.action ||
    'Nhấn "Bắt đầu" hoặc "Bước tiếp"';
  const isCompleted =
    currentStepData && currentStep === steps.length - 1;

  const currentArray = currentStepData?.array || array;
  const safeArray = Array.isArray(currentArray) ? currentArray : [];
  const maxValue = safeArray.length > 0 ? Math.max(...safeArray, 1) : 1;

  const features = algorithmInfo?.features || [];
  const useFeatures = features.length > 0;

  const filteredLegend = LEGEND.filter(item => {
    if (item.id === 'candidate') {
      if (useFeatures) return features.includes('candidate');
      return algorithmInfo?.slug === 'selection-sort';
    }
    if (item.id === 'pivot') {
      if (useFeatures) return features.includes('pivot');
      return algorithmInfo?.slug === 'quick-sort';
    }
    if (item.id === 'found') return isSearchMode;
    if (item.id === 'discarded') return algorithmInfo?.slug === 'binary-search';
    if (item.id === 'waiting') return algorithmInfo?.slug === 'quick-sort';
    if (item.id === 'swapping' || item.id === 'sorted') return !isSearchMode;
    return true;
  });

  return (
    <div className="visualizer-container">
      <div className="legend-container">
        {filteredLegend.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-color" style={{ background: item.color }} />
            <span className="legend-label">
              {item.id === 'candidate'
                ? `${sortOrder === 'asc' ? 'Nhỏ nhất' : 'Lớn nhất'} tạm thời`
                : item.label}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`step-status ${
          currentStepData?.found || isCompleted ? "completed" : ""
        }`}
      >
        {stepStatus}
      </div>
      <div className="bars-container">
        {safeArray.map((value, index) => {
          // SỬA LỖI Ở ĐÂY: Dùng phần trăm (%) thay vì pixel cứng để cột luôn co giãn theo màn hình
          // Chiều cao tối đa là 85% để luôn chừa lại 15% khoảng trống phía trên cho các con số
          const heightPct = (value / maxValue) * 85; 
          const colorScheme = getBarColor(index, currentStepData, isSearchMode);

          return (
            <div key={`bar-${index}`} className="bar-wrapper">
              <span className="bar-value">{value}</span>
              <div
                className="bar"
                style={{
                  height: `${heightPct}%`, // Set height bằng phần trăm
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