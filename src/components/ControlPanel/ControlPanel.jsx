import { useEffect, useRef, useState } from "react";
import { useSorting } from "../../context/SortingContext";
import "./ControlPanel.css";

export default function ControlPanel() {
  const {
    algorithmId,
    setAlgorithmId,
    speed,
    setSpeed,
    isRunning,
    setIsRunning,
    runAlgorithm,
    reset,
    steps,
    currentStep,
    setCurrentStep,       // Lấy hàm này ra để cập nhật bước
    sortOrder,
    toggleSortOrder,
    algorithms,
    generateRandomArray,
    setArray,
    generateSteps,        // Lấy hàm này để tự nạp dữ liệu khi đi bằng tay
    changeInputArray,     // Dùng hàm này khi submit form nhập mảng
  } = useSorting();

  const [inputValue, setInputValue] = useState("");
  const [hovered, setHovered] = useState(null);
  const [isAlgorithmMenuOpen, setIsAlgorithmMenuOpen] = useState(false);
  const algorithmMenuRef = useRef(null);

  const activeAlgorithms = (algorithms || []).filter((a) => a.status === 1);
  const selectedAlgorithm =
    activeAlgorithms.find((a) => a.id === algorithmId) || activeAlgorithms[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        algorithmMenuRef.current &&
        !algorithmMenuRef.current.contains(event.target)
      ) {
        setIsAlgorithmMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    const values = inputValue
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v) && v > 0);
    if (values.length > 0) {
      changeInputArray(values); // Gọi hàm chuẩn để tránh lỗi tự động Reset
      setInputValue("");
    }
  };

  const handleRandomArray = () => {
    generateRandomArray();
  };

  // Xử lý nút bấm thủ công (Không cần nhấn "Bắt đầu" trước vẫn chạy)
  const handleStepForward = async () => {
    let currentSteps = steps;
    let activeStep = currentStep;

    // Nếu mảng dữ liệu rỗng, tự động đi gọi API nạp dữ liệu
    if (steps.length === 0) {
      const fetchedSteps = await generateSteps();
      if (!fetchedSteps || fetchedSteps.length === 0) return; // Dừng lại nếu lỗi hoặc bị Redis chặn
      
      currentSteps = fetchedSteps;
      activeStep = 0; 
    }

    const nextStep = activeStep + 1;

    if (nextStep < currentSteps.length) {
      setCurrentStep(nextStep);
      
      const targetStep = currentSteps[nextStep];
      if (targetStep && targetStep.array) {
        setArray(targetStep.array);
      } else if (Array.isArray(targetStep)) {
        setArray(targetStep);
      }
    }
  };

  const canStepForward = !isRunning && (steps.length === 0 || currentStep < steps.length - 1);

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

  const handleAlgorithmSelect = (id) => {
    setAlgorithmId(id);
    setIsAlgorithmMenuOpen(false);
  };

  const isPaused = steps.length > 0 && !isRunning;

  return (
    <div className="control-panel">
      <div className="control-row">
        <div className="select-wrapper" ref={algorithmMenuRef}>
          <button
            type="button"
            onClick={() => setIsAlgorithmMenuOpen((open) => !open)}
            disabled={isRunning}
            className={`algorithm-select ${isRunning ? "disabled" : ""}`}
            aria-haspopup="listbox"
            aria-expanded={isAlgorithmMenuOpen}
          >
            <span>{selectedAlgorithm?.name || "Chọn thuật toán"}</span>
          </button>
          <span className="select-arrow">▼</span>
          {isAlgorithmMenuOpen && !isRunning && (
            <div className="algorithm-options" role="listbox">
              {activeAlgorithms.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  role="option"
                  aria-selected={a.id === algorithmId}
                  className={`algorithm-option ${
                    a.id === algorithmId ? "selected" : ""
                  }`}
                  onClick={() => handleAlgorithmSelect(a.id)}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={isRunning ? handlePause : handleStartOrContinue}
          {...handleHover("play")}
          className={`btn-play ${isRunning ? "pause" : "play"} ${hovered === "play" ? "hover" : ""
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
          disabled={!canStepForward}
          {...handleHover("step")}
          className={`btn-step ${canStepForward ? "active" : "inactive"} ${hovered === "step" && canStepForward ? "hover" : ""
            }`}
        >
          <StepIcon /> Bước tiếp
        </button>
        <button
          onClick={reset}
          {...handleHover("reset")}
          className={`btn-reset  ${hovered === "reset" && !isRunning ? "hover" : ""
            }`}
        >
          <ResetIcon /> Reset
        </button>

        <button
          onClick={toggleSortOrder}
          disabled={isRunning}
          {...handleHover("order")}
          className={`btn-order ${sortOrder === "asc" ? "asc" : "desc"} ${isRunning ? "disabled" : ""
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
          className={`btn-apply ${!isRunning && inputValue.trim() ? "active" : "inactive"
            } ${hovered === "apply" && !isRunning && inputValue.trim() ? "hover" : ""}`}
        >
          Áp dụng
        </button>

        <button
          onClick={handleRandomArray}
          disabled={isRunning}
          {...handleHover("random")}
          className={`btn-random ${isRunning ? "disabled" : ""} ${hovered === "random" && !isRunning ? "hover" : ""
            }`}
        >
          <ShuffleIcon /> Mảng ngẫu nhiên
        </button>
      </div>
    </div>
  );
}

// Giữ nguyên các hàm SVG Icon bên dưới của bạn...
function PlayIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>; }
function PauseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>; }
function StepIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,4 15,12 5,20" /><line x1="19" y1="4" x2="19" y2="20" /></svg>; }
function ResetIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>; }
function AscIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5,12 12,5 19,12" /></svg>; }
function DescIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19,12 12,19 5,12" /></svg>; }
function ShuffleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16,3 21,3 21,8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21,16 21,21 16,21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>; }
function SpeedIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M12 2a10 10 0 1 1-7.07 2.93" /><polyline points="12,6 12,12 16,14" /></svg>; }
