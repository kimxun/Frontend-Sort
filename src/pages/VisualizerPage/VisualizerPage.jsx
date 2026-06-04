import React, { useState } from 'react';
import './VisualizerPage.css';
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import Visualizer from '../../components/Visualizer/Visualizer';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Complexity from '../../components/Complexity/Complexity';

function VisualizerPage() {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [originalArray, setOriginalArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [isSorting, setIsSorting] = useState(false);
  
  // State lưu chỉ số vòng lặp i hiện tại để chạy từng bước
  const [currentI, setCurrentI] = useState(0);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Khi tạo mảng mới hoặc reset, ta phải đưa bước hiện tại về 0
  const generateRandomArray = () => {
    if (isSorting) return;
    const randomArr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(randomArr);
    setOriginalArray([...randomArr]);
    setCurrentI(0); 
  };

  const handleCustomArray = (customText) => {
    if (isSorting || !customText.trim()) return;
    const parsedArr = customText
      .split(',')
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num));
    
    if (parsedArr.length > 0) {
      setArray(parsedArr);
      setOriginalArray([...parsedArr]);
      setCurrentI(0);
    }
  };

  const handleReset = () => {
    if (isSorting) return;
    setArray([...originalArray]);
    setCurrentI(0);
  };

  // HÀM CHẠY TỪNG BƯỚC (Khi click nút TĂNG DẦN)
  const runNextStepAscending = () => {
    if (isSorting) return;
    
    let arr = [...array];
    let n = arr.length;

    // Nếu đã duyệt hết mảng thì dừng lại
    if (currentI >= n - 1) {
      return;
    }

    // Thực hiện đúng logic của 1 vòng lặp i đơn lẻ trong Selection Sort
    let minIndex = currentI;
    for (let j = currentI + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Hoán vị nếu tìm thấy phần tử nhỏ hơn
    if (minIndex !== currentI) {
      let temp = arr[currentI];
      arr[currentI] = arr[minIndex];
      arr[minIndex] = temp;
      setArray(arr); // Cập nhật mảng hiển thị lên giao diện ngay lập tức
    }

    // Tăng chỉ số i lên 1 để chuẩn bị cho lần bấm nút tiếp theo
    setCurrentI(prevI => prevI + 1);
  };

  // HÀM TỰ ĐỘNG CHẠY LIÊN TỤC (Khi click nút START)
  const runSelectionSort = async () => {
    if (isSorting) return;
    setIsSorting(true);

    let arr = [...array];
    let n = arr.length;

    // Vòng lặp sẽ tiếp tục chạy từ vị trí currentI hiện tại (kế thừa từ việc bấm nút TĂNG DẦN)
    for (let i = currentI; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        let temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;

        setArray([...arr]);
        await sleep(600); // Chờ hiệu ứng slow-motion
      }
      
      // Cập nhật giá trị bước liên tục trong quá trình chạy tự động
      setCurrentI(i + 1);
    }
    setIsSorting(false);
  };

  return (
    <div className="visualizer-page">
      <h1 className="header-title">SORTING ALGORITHM VISUALIZER</h1>
      
      <ControlPanel 
        onRandom={generateRandomArray} 
        onApplyCustom={handleCustomArray}
        onStart={runSelectionSort}
        onReset={handleReset}
        onNextStep={runNextStepAscending}
        isSorting={isSorting}
      />

      <div className="main-content">
        <div className="left-column">
          <Visualizer array={array} />
          <CodeBlock />
        </div>
        <div>
          <Complexity />
        </div>
      </div>

      <div className="card history-section">
        <h3 className="card-title">Lịch sử thực hiện</h3>
        <p>{isSorting ? "Đang chạy thuật toán..." : `Đang ở bước hoán vị thứ: ${currentI}`}</p>
      </div>
    </div>
  );
}

export default VisualizerPage;