import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAlgorithms, getAlgorithmSteps, getAlgorithmById } from '../services/algorithmService';

const SortingContext = createContext();

export const useSorting = () => useContext(SortingContext);

export const SortingProvider = ({ children }) => {
  const [algorithms, setAlgorithms] = useState([]);
  const [algorithmId, setAlgorithmId] = useState(1);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const [array, setArray] = useState([5, 3, 8, 1, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [speed, setSpeed] = useState(50);

  const [freeUsageCount, setFreeUsageCount] = useState(() => {
    return parseInt(localStorage.getItem('freeUsageCount')) || 0;
  });

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const data = await getAlgorithms();
        setAlgorithms(data);
        if (data.length > 0) setAlgorithmId(data[0].id);
      } catch (error) {
        console.error('Lỗi lấy danh sách thuật toán:', error);
      }
    };
    fetchAlgorithms();
  }, []);

  useEffect(() => {

  const fetchAlgorithmInfo = async () => {

    try {

      const data = await getAlgorithmById(
        algorithmId
      );

      setAlgorithmInfo(data);

    } catch (error) {

      console.error(
        'Lỗi lấy thông tin thuật toán:',
        error
      );
    }
  };

  if (algorithmId) {
    fetchAlgorithmInfo();
  }

}, [algorithmId]);

  const runAlgorithm = async () => {
    if (!array.length) return;

    const token = localStorage.getItem('token');

    if (!token) {
      if (freeUsageCount >= 3) {
        alert('Bạn đã sử dụng hết 3 lần miễn phí. Vui lòng đăng nhập để tiếp tục.');
        window.location.href = '/login';
        return;
      }
      const newCount = freeUsageCount + 1;
      setFreeUsageCount(newCount);
      localStorage.setItem('freeUsageCount', newCount);
    }

    setLoading(true);
    try {
      const data = await getAlgorithmSteps(algorithmId, array);
      setSteps(data.step_by_step || []);
      setCurrentStep(0);
      setIsRunning(true);
    } catch (error) {
      console.error('Lỗi lấy steps:', error);
      // Nếu có token nhưng vẫn 401 → token hết hạn
      if (error.response && error.response.status === 401 && token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const value = {
    algorithms,
    algorithmId,
    setAlgorithmId,
    array,
    setArray,
    steps,
    currentStep,
    setCurrentStep,
    isRunning,
    setIsRunning,
    loading,
    sortOrder,
    setSortOrder,
    speed,
    setSpeed,
    runAlgorithm,
    reset,
    freeUsageCount,
    algorithmInfo,
    setAlgorithmInfo,
  };

  return (
    <SortingContext.Provider value={value}>
      {children}
    </SortingContext.Provider>
  );
};