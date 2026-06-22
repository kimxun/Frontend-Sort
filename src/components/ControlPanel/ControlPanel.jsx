import { useState } from "react";
import { useSorting } from "../../context/SortingContext";
import "./ControlPanel.css";

const ALGORITHMS = [
  { value: 1, label: "Selection Sort" },
  { value: 2, label: "Quick Sort" },
  { value: 3, label: "Interchange Sort" },
];

export default function ControlPanel() {
  const {
    algorithmId,
    setAlgorithmId,
    setArray,
    speed,
    setSpeed,
    isRunning,
    setIsRunning,
    runAlgorithm,
    reset,
    steps,
    currentStep,
    setCurrentStep,
    sortOrder,
    toggleSortOrder,
  } = useSorting();

  const [inputValue, setInputValue] = useState("");
  const [hovered, setHovered] = useState(null);

  const handleSubmit = () => {
    const values = inputValue
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v) && v > 0);
    if (values.length > 0) {
      setArray(values);
      reset();
      setInputValue("");
    }
  };

  const handleRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    reset();
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStartOrContinue = () => {
    if (steps.length > 0 && !isRunning) {
      setIsRunning(true);
    } else {
      runAlgorithm();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleHover = (id) => ({
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
  });

  const isPaused = steps.length > 0 && !isRunning;

  return (
    <div className="control-panel">
      <div className="control-row">
        <div className="select-wrapper">
          <select
            value={algorithmId}
            onChange={(e) => setAlgorithmId(Number(e.target.value))}
            disabled={isRunning}
            className={`algorithm-select ${isRunning ? "disabled" : ""}`}
          >
            {ALGORITHMS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <span className="select-arrow">▼</span>
        </div>

        <button
          onClick={isRunning ? handlePause : handleStartOrContinue}
          {...handleHover("play")}
          className={`btn-play ${isRunning ? "pause" : "play"} ${
            hovered === "play" ? "hover" : ""
          }`}
        >
          {isRunning ? (
            <>
              <PauseIcon /> Tạm dừng
            </>
          ) : isPaused ? (
            <>
              <PlayIcon /> Tiếp tục
            </>
          ) : (
            <>
              <PlayIcon /> Bắt đầu
            </>
          )}
        </button>

        <button
          onClick={handleStepForward}
          disabled={isRunning || !steps.length || currentStep >= steps.length - 1}
          {...handleHover("step")}
          className={`btn-step ${
            !isRunning && steps.length && currentStep < steps.length - 1
              ? "active"
              : "inactive"
          } ${hovered === "step" && !isRunning && steps.length && currentStep < steps.length - 1 ? "hover" : ""}`}
        >
          <StepIcon /> Bước tiếp
        </button>

        <button
          onClick={reset}
          disabled={isRunning}
          {...handleHover("reset")}
          className={`btn-reset ${isRunning ? "disabled" : ""} ${
            hovered === "reset" && !isRunning ? "hover" : ""
          }`}
        >
          <ResetIcon /> Reset
        </button>

        <button
          onClick={toggleSortOrder}
          disabled={isRunning}
          {...handleHover("order")}
          className={`btn-order ${sortOrder === "asc" ? "asc" : "desc"} ${
            isRunning ? "disabled" : ""
          } ${hovered === "order" && !isRunning ? "hover" : ""}`}
        >
          {sortOrder === "asc" ? <AscIcon /> : <DescIcon />}
          {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
        </button>

        <div className="speed-control">
          <SpeedIcon />
          <span className="speed-label">Tốc độ</span>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isRunning}
            className={`speed-slider ${isRunning ? "disabled" : ""}`}
          />
          <span className="speed-value">{speed}x</span>
        </div>
      </div>

      <div className="control-row">
        <div className="array-input-wrapper">
          <input
            type="text"
            placeholder="Nhập mảng: 5, 2, 8, 1, 9, ..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isRunning}
            className={`array-input ${isRunning ? "disabled" : ""}`}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isRunning || !inputValue.trim()}
          {...handleHover("apply")}
          className={`btn-apply ${
            !isRunning && inputValue.trim() ? "active" : "inactive"
          } ${hovered === "apply" && !isRunning && inputValue.trim() ? "hover" : ""}`}
        >
          Áp dụng
        </button>

        <button
          onClick={handleRandomArray}
          disabled={isRunning}
          {...handleHover("random")}
          className={`btn-random ${isRunning ? "disabled" : ""} ${
            hovered === "random" && !isRunning ? "hover" : ""
          }`}
        >
          <ShuffleIcon /> Mảng ngẫu nhiên
        </button>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function StepIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5,4 15,12 5,20" />
      <line x1="19" y1="4" x2="19" y2="20" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function AscIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  );
}

function DescIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19,12 12,19 5,12" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16,3 21,3 21,8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21,16 21,21 16,21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
      <path d="M12 2a10 10 0 1 1-7.07 2.93" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}