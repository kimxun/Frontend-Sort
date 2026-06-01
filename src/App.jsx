import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import các component con đã bẻ nhỏ
import ControlPanel from './components/ControlPanel';
import Visualizer from './components/Visualizer';
import CodeBlock from './components/CodeBlock';
import Complexity from './components/Complexity';

function App() {
  // ─── STATE QUẢN LÝ CHẾ ĐỘ XEM & BẢO MẬT ───────────────────────────
  const [viewMode, setViewMode] = useState('user'); // 'user' hoặc 'admin'
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập của Admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ─── STATE DÀNH CHO GIAO DIỆN MÔ PHỎNG (USER) ────────────────────
  const [array, setArray] = useState([5, 2, 9, 1, 5, 6]);
  const [inputVal, setInputVal] = useState("5, 2, 9, 1, 5, 6");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // ─── STATE DỮ LIỆU ĐỘNG (LẤY TỪ BACKEND FLASK) ──────────────────
  const [algoData, setAlgoData] = useState({}); 
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('interchange');

  // ─── STATE DÀNH CHO FORM THÊM / SỬA CỦA ADMIN ────────────────────
  const [formKey, setFormKey] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formPseudo, setFormPseudo] = useState('');
  const [formComplexity, setFormComplexity] = useState({ best: '', avg: '', worst: '', space: '' });

  // 1. Tải thông tin danh sách thuật toán từ Flask khi mở trang
  const loadAlgorithms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/algorithms');
      setAlgoData(response.data);
      const keys = Object.keys(response.data);
      if (keys.length > 0 && (!response.data[selectedAlgoKey])) {
        setSelectedAlgoKey(keys[0]);
      }
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu giải thuật:", error);
    }
  };

  useEffect(() => {
    loadAlgorithms();
  }, []);

  // 2. Tự động cập nhật trạng thái mảng khi người dùng bấm Next Step
  useEffect(() => {
    if (currentStep >= 0 && steps[currentStep]) {
      setArray(steps[currentStep].array);
    }
  }, [currentStep, steps]);

  // 3. Hàm kích hoạt chạy mô phỏng (Gọi API tính toán các bước từ Python Flask)
  const startSorting = async () => {
    try {
      const parsedArray = inputVal.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
      setArray(parsedArray);

      const response = await axios.post('http://localhost:5000/api/sort', {
        array: parsedArray,
        algorithm: selectedAlgoKey
      });

      setSteps(response.data.steps);
      setCurrentStep(0);
    } catch (error) {
      alert("Không thể kết nối đến Backend Flask! Hãy đảm bảo bạn đã khởi động server Python.");
    }
  };

  // 4. Xử lý Đăng nhập & Đăng xuất hệ thống Admin
  const handleLogin = (e) => {
    e.preventDefault();
    // Tài khoản đăng nhập mặc định (Bạn có thể tùy ý chỉnh sửa lại ở đây)
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
    } else {
      alert('Tài khoản hoặc mật khẩu Quản trị viên không chính xác!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setViewMode('user');
    alert('Đã đăng xuất tài khoản quản trị.');
  };

  // 5. Xử lý Lưu (Thêm mới hoặc Cập nhật thuật toán) lên Server
  const handleSaveAlgorithm = async (e) => {
    e.preventDefault();
    if (!formKey.trim()) return alert("Vui lòng nhập Mã Khóa giải thuật!");

    const payload = {
      title: formTitle,
      pseudo_code: formPseudo.split('\n').filter(line => line.trim() !== ''),
      complexity: formComplexity
    };

    try {
      await axios.post(`http://localhost:5000/api/algorithms/${formKey.toLowerCase().trim()}`, payload);
      alert("Lưu thông tin giải thuật vào hệ thống thành công!");
      setFormKey(''); setFormTitle(''); setFormPseudo('');
      setFormComplexity({ best: '', avg: '', worst: '', space: '' });
      loadAlgorithms();
    } catch (error) {
      alert("Lỗi không thể ghi nhận dữ liệu lên Server!");
    }
  };

  // 6. Xử lý xóa thuật toán ra khỏi cơ sở dữ liệu Flask
  const handleDeleteAlgorithm = async (key) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa giải thuật [ ${key} ] ra khỏi hệ thống?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/algorithms/${key}`);
        alert("Đã xóa giải thuật thành công!");
        loadAlgorithms();
      } catch (error) {
        alert("Lỗi xảy ra trong quá trình xóa dữ liệu!");
      }
    }
  };

  // 7. Sinh mảng ngẫu nhiên cho User chơi thử
  const generateRandomArray = () => {
    const randomArr = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1);
    setArray(randomArr);
    setInputVal(randomArr.join(", "));
    setSteps([]);
    setCurrentStep(-1);
  };

  // Trích xuất các biến bổ trợ hiển thị theo thời gian thực (Real-time tracking)
  const activeComparing = currentStep >= 0 && steps[currentStep] ? steps[currentStep].comparing : [-1, -1];
  const activeLine = currentStep >= 0 && steps[currentStep] ? steps[currentStep].highlight_line : -1;
  const stepDescription = currentStep >= 0 && steps[currentStep] ? steps[currentStep].desc : "Chờ khởi tạo mảng và nhấn Bắt Đầu.";

  const currentPseudo = algoData[selectedAlgoKey]?.pseudo_code || ["// Chưa có dữ liệu mã giả."];
  const currentComplexity = algoData[selectedAlgoKey]?.complexity || { best: "---", avg: "---", worst: "---", space: "---" };

  // Khung định dạng thẻ dùng chung cho giao diện Admin
  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #eaeaea'
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", sans-serif' }}>
      
      {/* ─── GLOBAL HEADER BAR ─────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>
        </h2>
        
        {/* NÚT THAY ĐỔI THEO TRẠNG THÁI LOGIN */}
        {viewMode === 'user' ? (
          <button 
            onClick={() => setViewMode('admin')}
            style={{ padding: '10px 20px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ⚙️ Đăng nhập
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setViewMode('user')} style={{ padding: '10px 15px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📊 Xem Mô Phỏng Thuật Toán Sắp Xếp</button>
            {isLoggedIn && <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🚪 Đăng Xuất</button>}
          </div>
        )}
      </div>

      {/* ─── CHẾ ĐỘ 1: KHU VỰC ADMIN (CÓ FORM LOGIN BẢO MẬT CHẶN TRƯỚC) ─── */}
      {viewMode === 'admin' && (
        <>
          {/* TRƯỜNG HỢP CHƯA ĐĂNG NHẬP -> CHẶN FORM LOGIN */}
          {!isLoggedIn ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '60px' }}>
              <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '360px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#0f172a' }}>Đăng Nhập Quản Trị Viên</h3>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Tài khoản:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Nhập tài khoản..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px', color: '#475569' }}>Mật khẩu:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Nhập mật khẩu..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    🔑 Đăng Nhập Hệ Thống
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP THÀNH CÔNG -> MỞ KHÓA GIAO DIỆN CRUD THUẬT TOÁN */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* BÊN TRÁI: DANH SÁCH THUẬT TOÁN */}
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>Danh Sách Thuật Toán Hệ Thống</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0' }}>Key / Tên giải thuật</th>
                      <th style={{ padding: '12px', borderBottom: '2px solid #e2e8f0', textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(algoData).map((key) => (
                      <tr key={key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>
                          <strong style={{ color: '#2563eb' }}>{key}</strong> — {algoData[key].title}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button 
                            onClick={() => { 
                              setFormKey(key); 
                              setFormTitle(algoData[key].title); 
                              setFormPseudo(algoData[key].pseudo_code.join('\n')); 
                              setFormComplexity(algoData[key].complexity); 
                            }} 
                            style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Sửa
                          </button>
                          <button 
                            onClick={() => handleDeleteAlgorithm(key)} 
                            style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* BÊN PHẢI: FORM CẬP NHẬT / THÊM MỚI */}
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0, color: '#0f172a' }}>Cập Nhật / Thêm Thuật Toán Mới</h3>
                <form onSubmit={handleSaveAlgorithm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="text" value={formKey} onChange={(e) => setFormKey(e.target.value)} placeholder="Mã khóa định danh (Ví dụ: bubble, quick)" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Tên giải thuật hiển thị" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                  <textarea rows="4" value={formPseudo} onChange={(e) => setFormPseudo(e.target.value)} placeholder="Mã giả thuật toán (Xuống dòng cho mỗi câu lệnh)" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" placeholder="Best Case (Tốt nhất)" value={formComplexity.best} onChange={(e) => setFormComplexity({...formComplexity, best: e.target.value})} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <input type="text" placeholder="Avg Case (Trung bình)" value={formComplexity.avg} onChange={(e) => setFormComplexity({...formComplexity, avg: e.target.value})} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <input type="text" placeholder="Worst Case (Tệ nhất)" value={formComplexity.worst} onChange={(e) => setFormComplexity({...formComplexity, worst: e.target.value})} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                    <input type="text" placeholder="Space Complexity (Bộ nhớ)" value={formComplexity.space} onChange={(e) => setFormComplexity({...formComplexity, space: e.target.value})} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                  </div>
                  
                  <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                    💾 Lưu Thuật Toán Vào Hệ Thống
                  </button>
                </form>
              </div>

            </div>
          )}
        </>
      )}

      {/* ─── CHẾ ĐỘ 2: GIAO DIỆN MÔ PHỎNG USER (BỐ CỤC ĐƯỢC PHÂN TÁCH) ─── */}
      {viewMode === 'user' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 420px', gap: '20px', alignItems: 'start' }}>
          
          <ControlPanel 
            selectedAlgoKey={selectedAlgoKey} setSelectedAlgoKey={setSelectedAlgoKey}
            setSteps={setSteps} setCurrentStep={setCurrentStep} algoData={algoData}
            inputVal={inputVal} setInputVal={setInputVal} generateRandomArray={generateRandomArray}
            startSorting={startSorting} currentStep={currentStep} steps={steps}
          />

          <Visualizer 
            array={array} activeComparing={activeComparing} 
            currentStep={currentStep} stepDescription={stepDescription} 
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodeBlock currentPseudo={currentPseudo} activeLine={activeLine} />
            <Complexity currentComplexity={currentComplexity} />
          </div>

        </div>
      )}

    </div>
  );
}

export default App;