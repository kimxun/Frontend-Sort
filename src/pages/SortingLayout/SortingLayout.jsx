import React from 'react';
import { useSorting } from '../../context/SortingContext';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import AlgorithmInfo from '../../components/AlgorithmInfo/AlgorithmInfo';
import VariablesPanel from '../../components/VariablesPanel/VariablesPanel';
import SortingVisualizer from '../../components/SortingVisualizer/SortingVisualizer';
import CodePanel from '../../components/CodePanel/CodePanel';
import HistoryPanel from '../../components/HistoryPanel/HistoryPanel';
import './SortingLayout.css';
import { logout, getCurrentUser } from '../../services/authService';
const SortingLayout = () => {
  const {
    algorithms,
    algorithmId,
    setAlgorithmId,
    array,
    setArray,
    steps,
    currentStep,
    isRunning,
    loading,
    sortOrder,
    setSortOrder,
    speed,
    setSpeed,
    runAlgorithm,
    reset,
  } = useSorting();
  const user = getCurrentUser();
  const getFileName = (algo) => {
    switch (algo) {
      case "selection": return "selectionSort.js";
      case "interchange": return "interchangeSort.js";
      case "quick": return "quickSort.js";
      default: return "algorithm.js";
    }
  };

  const renderHeader = () => (
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

      <div className="header-actions">

        {
          user?.role === 1 && (

            <button
              className="header-admin-btn"
              onClick={() =>
                window.location.href = "/admin"
              }
            >
              Admin
            </button>

          )
        }

        {
          user ? (

            <div className="header-user">

              <span className="header-username">
                Xin chào, {user.username}
              </span>

              <button
                className="header-login-btn"
                onClick={logout}
              >
                Đăng xuất
              </button>

            </div>

          ) : (

            <button
              className="header-login-btn"
              onClick={() =>
                window.location.href = "/login"
              }
            >
              Đăng nhập
            </button>

          )
        }
      </div>

    </div>

  );

  const renderVisualizer = () => {
    const currentArray = steps.length > 0 && currentStep < steps.length
      ? steps[currentStep]
      : array;

    return (
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
            array={currentArray}
            comparing={[]}
            swapping={[]}
            sorted={[]}
            currentIndex={currentStep}
          />
        </div>
      </div>
    );
  };

  const renderCodePanel = () => (
    <div className="panel-window">
      <div className="panel-window__header">
        <div className="mac-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="panel-window__title">{getFileName(algorithmId)}</span>
      </div>
      <div className="panel-window__content code-content">
        <CodePanel algorithm={algorithmId} currentLine={0} />
      </div>
    </div>
  );

  const handleStart = () => runAlgorithm();
  const handleReset = () => reset();
  const handleAlgorithmChange = (e) => setAlgorithmId(Number(e.target.value));
  const handleArrayInput = (newArray) => setArray(newArray);
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);
  const handleSpeedChange = (e) => setSpeed(Number(e.target.value));

  return (
    <div className="sorting-layout">
      {renderHeader()}

      <div className="layout-desktop">
        <div className="sorting-layout__main">
          <div className="layout-column layout-column--center">
            {renderVisualizer()}
            <ControlPanel
              isRunning={isRunning}
              algorithm={algorithmId}
              sortOrder={sortOrder}
              speed={speed}
              onStart={handleStart}
              onPause={() => { }}
              onReset={handleReset}
              onAlgorithmChange={handleAlgorithmChange}
              onSortOrderChange={handleSortOrderChange}
              onSpeedChange={handleSpeedChange}
              onArrayInput={handleArrayInput}
              onRandomArray={() => setArray([...Array(10)].map(() => Math.floor(Math.random() * 100) + 1))}
              onStepForward={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
              canStepForward={currentStep < steps.length - 1}
            />
            {renderCodePanel()}
          </div>
          <div className="layout-column layout-column--right">
            <AlgorithmInfo algorithmId={algorithmId} />
            <VariablesPanel variables={{}} />
            <HistoryPanel history={steps} />
          </div>
        </div>
      </div>

      <div className="layout-mobile">
        <div className="mobile-layout">
          <AlgorithmInfo algorithmId={algorithmId} />
          {renderVisualizer()}
          <ControlPanel
            isRunning={isRunning}
            algorithm={algorithmId}
            sortOrder={sortOrder}
            speed={speed}
            onStart={handleStart}
            onPause={() => { }}
            onReset={handleReset}
            onAlgorithmChange={handleAlgorithmChange}
            onSortOrderChange={handleSortOrderChange}
            onSpeedChange={handleSpeedChange}
            onArrayInput={handleArrayInput}
            onRandomArray={() => setArray([...Array(10)].map(() => Math.floor(Math.random() * 100) + 1))}
            onStepForward={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
            canStepForward={currentStep < steps.length - 1}
          />
          {renderCodePanel()}
          <VariablesPanel variables={{}} />
          <HistoryPanel history={steps} />
        </div>
      </div>
    </div>
  );
};

export default SortingLayout; 