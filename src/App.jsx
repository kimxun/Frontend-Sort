import React, { useState } from 'react';
import './index.css';
import SortingLayout from './pages/SortingLayout/SortingLayout.jsx';

function App() {
  const [array, setArray] = useState([45, 20, 80, 65, 30, 95, 10, 55]);  
  const [algorithm, setAlgorithm] = useState('interchange');            
  const [sortOrder, setSortOrder] = useState('asc');                 
  const [speed, setSpeed] = useState(50);                             
  const [isRunning, setIsRunning] = useState(false);                  
  const [history, setHistory] = useState(['Khởi tạo mảng ngẫu nhiên thành công.']);
  const [variables, setVariables] = useState({ i: 0, j: 0, min_idx: 0 }); 
  const [comparing, setComparing] = useState([]); 
  const [swapping, setSwapping] = useState([]);   
  const [sorted, setSorted] = useState([]);       
  const [currentIndex, setCurrentIndex] = useState(-1);


  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setArray([45, 20, 80, 65, 30, 95, 10, 55]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
  };


  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleStepForward = () => console.log("Chạy tiến 1 bước");
  const handleArrayInput = (newArray) => setArray(newArray);
  const handleRandomArray = () => {
    const random = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(random);
    setSorted([]);
  };

  return (
    <div className="app-container dark">
      <SortingLayout 
        isRunning={isRunning}
        algorithm={algorithm}
        sortOrder={sortOrder}
        speed={speed}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onAlgorithmChange={setAlgorithm}
        onSortOrderChange={handleSortOrderChange} 
        onSpeedChange={setSpeed}
        onArrayInput={handleArrayInput}
        onRandomArray={handleRandomArray}
        onStepForward={handleStepForward}
        canStepForward={!isRunning}
        array={array}
        comparing={comparing}
        swapping={swapping}
        sorted={sorted}
        currentIndex={currentIndex}
        currentLine={0} 
        history={history}
        variables={variables}
      />
    </div>
  );
}

export default App;