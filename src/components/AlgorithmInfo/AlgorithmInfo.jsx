import React from 'react';
import './AlgorithmInfo.css';

const INFO = {
  selection: {
    name: "Selection Sort",
    tagline: "Tìm min, đặt vào vị trí",
    description: "Tìm phần tử nhỏ nhất trong phần chưa sắp xếp, đặt vào đầu danh sách. Lặp lại cho đến hết.",
    time: "O(n²)",
    space: "O(1)",
    stable: false,
    steps: ["Đặt i = 0, minIdx = i", "Duyệt j từ i+1 đến cuối", "Nếu a[j] < a[minIdx] → minIdx = j", "Hoán đổi a[i] ↔ a[minIdx]", "Tăng i, lặp lại"],
  },
  interchange: {
    name: "Interchange Sort",
    tagline: "So sánh mọi cặp, đổi chỗ",
    description: "So sánh từng cặp phần tử theo thứ tự và hoán đổi ngay nếu chúng không đúng vị trí.",
    time: "O(n²)",
    space: "O(1)",
    stable: false,
    steps: ["Duyệt i từ 0 đến n-2", "Duyệt j từ i+1 đến n-1", "Nếu a[i] > a[j] → hoán đổi a[i] ↔ a[j]", "Tăng i, lặp lại"],
  },
  quick: {
    name: "Quick Sort",
    tagline: "Chia để trị, chọn pivot",
    description: "Chọn pivot, phân mảng thành 2 phần (nhỏ hơn / lớn hơn pivot), đệ quy sắp xếp từng phần.",
    time: "O(n log n) avg",
    space: "O(log n)",
    stable: false,
    steps: ["Chọn pivot = a[right]", "Phân vùng: đưa phần tử ≤ pivot sang trái", "Đặt pivot vào đúng vị trí", "Đệ quy với 2 nửa"],
  },
};

const AlgorithmInfo = ({ algorithm }) => {
  const info = INFO[algorithm];
  if (!info) return null; // hoặc hiển thị thông báo lỗi

  return (
    <div className="algorithm-info">
      <div className="algorithm-info-header">
        <div className="algorithm-info-header-content">
          {/* <span className="algorithm-info-emoji">{info.emoji}</span> */}
          <div>
            <div className="algorithm-info-name">{info.name}</div>
            <div className="algorithm-info-tagline">{info.tagline}</div>
          </div>
        </div>
      </div>

      <div className="algorithm-info-body">
        <p className="algorithm-info-description">{info.description}</p>

        <div className="algorithm-info-badges">
          <div className="badge badge-time">
            <span className="badge-label">time </span>
            <span className="badge-value">{info.time}</span>
          </div>
          <div className="badge badge-space">
            <span className="badge-label">space </span>
            <span className="badge-value">{info.space}</span>
          </div>
          <div className={`badge ${info.stable ? 'badge-stable' : 'badge-unstable'}`}>
            <span>{info.stable ? 'stable' : 'unstable'}</span>
          </div>
        </div>

        <div className="algorithm-info-steps">
          <div className="steps-title">Các bước</div>
          <div className="steps-list">
            {info.steps.map((step, i) => (
              <div key={i} className="step-item">
                <span className="step-number">{i + 1}.</span>
                <span className="step-text">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfo;