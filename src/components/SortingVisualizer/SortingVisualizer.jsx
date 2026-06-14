import React from 'react';
import { motion } from 'motion/react';
import './SortingVisualizer.css';

const BAR_COLORS = {
  default:   { bg: "#3b82f6", glow: "0 0 12px rgba(59,130,246,0.5)" },
  comparing: { bg: "#f59e0b", glow: "0 0 14px rgba(245,158,11,0.6)" },
  swapping:  { bg: "#ef4444", glow: "0 0 14px rgba(239,68,68,0.6)" },
  current:   { bg: "#a855f7", glow: "0 0 14px rgba(168,85,247,0.6)" },
  sorted:    { bg: "#10b981", glow: "0 0 12px rgba(16,185,129,0.4)" },
};

const LEGEND = [
  { color: BAR_COLORS.default.bg,   label: "Chưa xử lý" },
  { color: BAR_COLORS.comparing.bg, label: "Đang so sánh" },
  { color: BAR_COLORS.swapping.bg,  label: "Đang hoán đổi" },
  { color: BAR_COLORS.current.bg,   label: "Phần tử chốt" },
  { color: BAR_COLORS.sorted.bg,    label: "Đã sắp xếp" },
];

const SortingVisualizer = ({ array, comparing, swapping, sorted, currentIndex }) => {
  const maxValue = Math.max(...array, 1);

  const getStyle = (index) => {
    if (sorted.includes(index)) return BAR_COLORS.sorted;
    if (swapping.includes(index)) return BAR_COLORS.swapping;
    if (comparing.includes(index)) return BAR_COLORS.comparing;
    if (index === currentIndex) return BAR_COLORS.current;
    return BAR_COLORS.default;
  };

  return (
    <div className="visualizer-container">
      <div className="legend-container">
        {LEGEND.map((item) => (
          <div key={item.label} className="legend-item">
            <div className="legend-color" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}80` }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="bars-container">
        {array.map((value, index) => {
          const style = getStyle(index);
          const heightPct = (value / maxValue) * 100;
          const barWidth = Math.max(28, Math.min(56, Math.floor(480 / array.length) - 8));

          return (
            <div key={`bar-${index}`} className="bar-wrapper">
              <span className="bar-value" style={{ color: style.bg }}>{value}</span>
              <motion.div
                className="bar"
                animate={{ height: `${Math.max(heightPct * 2, 8)}px` }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{
                  width: barWidth,
                  background: `linear-gradient(180deg, ${style.bg}ee, ${style.bg}99)`,
                  boxShadow: style.glow,
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