import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveAlgorithms } from '../../services/algorithmService';
import { toast } from 'react-toastify';
import './CompareAlgorithms.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CompareAlgorithms = () => {
  const navigate = useNavigate();
  const [algorithms, setAlgorithms] = useState([]);
  const [algo1, setAlgo1] = useState('');
  const [algo2, setAlgo2] = useState('');
  const [inputArray, setInputArray] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login', { state: { from: '/compare' }, replace: true });
      }
    } else {
      navigate('/login', { state: { from: '/compare' }, replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchAlgorithms = async () => {
      try {
        const data = await getActiveAlgorithms();
        const list = Array.isArray(data) ? data : data?.data || [];
        setAlgorithms(list.filter((a) => a.status === 1));
      } catch (err) {
        toast.error('Không thể tải danh sách thuật toán');
      }
    };
    fetchAlgorithms();
  }, [user]);

  const handleCompare = async () => {
    if (!algo1 || !algo2) {
      toast.warning('Vui lòng chọn hai thuật toán');
      return;
    }

    const selectedAlgo1 = algorithms.find((a) => a.id === parseInt(algo1));
    const selectedAlgo2 = algorithms.find((a) => a.id === parseInt(algo2));

    if (!selectedAlgo1 || !selectedAlgo2) {
      toast.error('Không tìm thấy thông tin thuật toán. Vui lòng thử lại.');
      return;
    }

    const arr = inputArray
      .split(',')
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (arr.length === 0) {
      toast.warning('Vui lòng nhập mảng hợp lệ');
      return;
    }
    if (arr.length > 20) {
      toast.warning('Tối đa 20 phần tử');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/algorithms/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          array: arr,
          algorithm_id_1: parseInt(algo1),
          algorithm_id_2: parseInt(algo2),
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Lỗi khi so sánh thuật toán';
        try {
          const errData = await res.json();
          errorMsg = errData?.error || errData?.message || errorMsg;
        } catch (jsonError) {
          errorMsg = `Lỗi server (${res.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      toast.error(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="compare-container">
      <h2>So sánh thuật toán</h2>
      <div className="compare-controls">
        <div className="compare-selects">
          <select value={algo1} onChange={(e) => setAlgo1(e.target.value)}>
            <option value="">-- Chọn thuật toán 1 --</option>
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
          <select value={algo2} onChange={(e) => setAlgo2(e.target.value)}>
            <option value="">-- Chọn thuật toán 2 --</option>
            {algorithms.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>
        <div className="compare-array-input">
          <input
            type="text"
            placeholder="Nhập mảng, ví dụ: 5,3,8,1,2"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
          />
        </div>
        <button onClick={handleCompare} disabled={loading}>
          {loading ? 'Đang so sánh...' : 'So sánh'}
        </button>
      </div>

      {result && (
        <div className="compare-results">
          <table>
            <thead>
              <tr>
                <th>Tiêu chí</th>
                <th>{result.algorithm_1.name}</th>
                <th>{result.algorithm_2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Số bước</td>
                <td>{result.algorithm_1.steps}</td>
                <td>{result.algorithm_2.steps}</td>
              </tr>
              <tr>
                <td>Số lần so sánh</td>
                <td>{result.algorithm_1.comparisons}</td>
                <td>{result.algorithm_2.comparisons}</td>
              </tr>
              <tr>
                <td>Số lần hoán đổi</td>
                <td>{result.algorithm_1.swaps}</td>
                <td>{result.algorithm_2.swaps}</td>
              </tr>
              <tr>
                <td>Thời gian (ms)</td>
                <td>{result.algorithm_1.time_ms}</td>
                <td>{result.algorithm_2.time_ms}</td>
              </tr>
              <tr>
                <td>Mảng sau sắp xếp</td>
                <td>{result.algorithm_1.sorted.join(', ')}</td>
                <td>{result.algorithm_2.sorted.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareAlgorithms;