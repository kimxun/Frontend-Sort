import React, { useState } from 'react';
import './index.css';
import SortingLayout from './pages/SortingLayout/SortingLayout.jsx';

function App() {
  // 1. Tạo các State lưu trữ dữ liệu mô phỏng
  const [array, setArray] = useState([45, 20, 80, 65, 30, 95, 10, 55]); // Mảng các cột số
  
  // ĐÃ ĐỔI: Đặt mặc định là 'interchange' để vừa vào trang là hiện ngay Interchange Sort 
  const [algorithm, setAlgorithm] = useState('interchange');            
  const [sortOrder, setSortOrder] = useState('asc');                   // Thứ tự tăng/giảm
  const [speed, setSpeed] = useState(50);                              // Tốc độ chạy (ms)
  const [isRunning, setIsRunning] = useState(false);                   // Trạng thái có đang chạy tự động không
  const [history, setHistory] = useState(['Khởi tạo mảng ngẫu nhiên thành công.']); // Nhật ký các bước
  const [variables, setVariables] = useState({ i: 0, j: 0, min_idx: 0 }); // Các biến chạy trong code mẫu
  
  // Các biến đánh dấu trạng thái cột để tô màu khi mô phỏng
  const [comparing, setComparing] = useState([]); // Các cột đang so sánh
  const [swapping, setSwapping] = useState([]);   // Các cột đang đổi chỗ
  const [sorted, setSorted] = useState([]);       // Các cột đã sắp xếp xong
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 2. Định nghĩa các hàm xử lý sự kiện
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setArray([45, 20, 80, 65, 30, 95, 10, 55]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
  };

  // ĐÃ SỬA LỖI: Tạo hàm đổi chiều tăng/giảm liên tục (Toggle) thay vì truyền trực tiếp setSortOrder
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
      {/* 3. Truyền ĐẦY ĐỦ các props vào trong SortingLayout */}
      <SortingLayout 
        // ControlPanel props
        isRunning={isRunning}
        algorithm={algorithm}
        sortOrder={sortOrder}
        speed={speed}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onAlgorithmChange={setAlgorithm}
        onSortOrderChange={handleSortOrderChange} // Đã đổi sang hàm handleSortOrderChange mới sửa ở trên
        onSpeedChange={setSpeed}
        onArrayInput={handleArrayInput}
        onRandomArray={handleRandomArray}
        onStepForward={handleStepForward}
        canStepForward={!isRunning}
        
        // Visualizer props
        array={array}
        comparing={comparing}
        swapping={swapping}
        sorted={sorted}
        currentIndex={currentIndex}

        // CodePanel props
        currentLine={0} // Dòng code đang sáng (mặc định dòng 0)

        // HistoryPanel props
        history={history}

        // VariablesPanel props
        variables={variables}
      />
    </div>
  );
}

export default App;