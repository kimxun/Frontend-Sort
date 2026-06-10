import React from "react";
import ControlPanel from "../../components/ControlPanel/ControlPanel";
import AlgorithmInfo from "../../components/AlgorithmInfo/AlgorithmInfo";
import VariablesPanel from "../../components/VariablesPanel/VariablesPanel";
import SortingVisualizer from "../../components/SortingVisualizer/SortingVisualizer";
import CodePanel from "../../components/CodePanel/CodePanel";
import HistoryPanel from "../../components/HistoryPanel/HistoryPanel";
import "./SortingLayout.css";

const SortingLayout = ({
  isRunning,
  algorithm,
  sortOrder,
  speed,
  onStart,
  onPause,
  onReset,
  onAlgorithmChange,
  onSortOrderChange,
  onSpeedChange,
  onArrayInput,
  onRandomArray,
  onStepForward,
  canStepForward,
  array,
  comparing,
  swapping,
  sorted,
  currentIndex,
  currentLine,
  history,
  variables,
}) => {
  // Hàm tạo tên file dựa trên thuật toán đang chọn
  const getFileName = (algo) => {
    switch (algo) {
      case "selection":
        return "selectionSort.js";
      case "interchange":
        return "interchangeSort.js";
      case "quick":
        return "quickSort.js";
      default:
        return "algorithm.js";
    }
  };

  return (
    <div className="sorting-layout">
      <div className="sorting-layout__header">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
        </div>
        <div className="brand-title">
          <h1>SORTING VISUALIZER</h1>
          <p>Algorithm Animation Studio</p>
        </div>
      </div>

      <div className="sorting-layout__main">
        {/* Cột trái */}
        <div className="layout-column layout-column--center">
          
          <div className="panel-window">
            <div className="panel-window__header">
              <div className="mac-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="panel-window__title">Algorithm Animation Studio</span>
            </div>
            <div className="panel-window__content">
              <SortingVisualizer
                array={array}
                comparing={comparing}
                swapping={swapping}
                sorted={sorted}
                currentIndex={currentIndex}
              />
            </div>
          </div>
          
          <ControlPanel
            isRunning={isRunning}
            algorithm={algorithm}
            sortOrder={sortOrder}
            speed={speed}
            onStart={onStart}
            onPause={onPause}
            onReset={onReset}
            onAlgorithmChange={onAlgorithmChange}
            onSortOrderChange={onSortOrderChange}
            onSpeedChange={onSpeedChange}
            onArrayInput={onArrayInput}
            onRandomArray={onRandomArray}
            onStepForward={onStepForward}
            canStepForward={canStepForward}
          />

          <div className="panel-window">
            <div className="panel-window__header">
              <div className="mac-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>

              <span className="panel-window__title">{getFileName(algorithm)}</span>
            </div>
            <div className="panel-window__content code-content">
              <CodePanel algorithm={algorithm} currentLine={currentLine} />
            </div>
          </div>

        </div>


        <div className="layout-column layout-column--right">
          <AlgorithmInfo algorithm={algorithm} />
          <VariablesPanel variables={variables} />
          <HistoryPanel history={history} />
        </div>
      </div>
    </div>
  );
};

export default SortingLayout;