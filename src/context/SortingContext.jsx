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
  const [infoLoading, setInfoLoading] = useState(false);
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
        console.error(error);
      }
    };
    fetchAlgorithms();
  }, []);

  useEffect(() => {
    const fetchAlgorithmInfo = async () => {
      if (!algorithmId) return;
      setInfoLoading(true);
      try {
        const data = await getAlgorithmById(algorithmId);
        setAlgorithmInfo(data);
      } catch (error) {
        setAlgorithmInfo(null);
      } finally {
        setInfoLoading(false);
      }
    };
    fetchAlgorithmInfo();
  }, [algorithmId]);

  useEffect(() => {
    let timer;
    if (isRunning && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = prevStep + 1;
          if (nextStep < steps.length) {
            setArray(steps[nextStep].array);
            return nextStep;
          } else {
            setIsRunning(false);
            clearInterval(timer);
            return prevStep;
          }
        });
      }, Math.max(50, 1000 - speed * 8));
    }
    return () => clearInterval(timer);
  }, [isRunning, steps, speed]);

  const runAlgorithm = async () => {
    if (!array.length) return;

    const token = localStorage.getItem('token');
    if (!token) {
      if (freeUsageCount >= 3) {
        alert('Bạn đã sử dụng hết 3 lần miễn phí.');
        window.location.href = '/login';
        return;
      }
      const newCount = freeUsageCount + 1;
      setFreeUsageCount(newCount);
      localStorage.setItem('freeUsageCount', newCount);
    }

    setLoading(true);
    try {
      const data = await getAlgorithmSteps(algorithmId, array, sortOrder);
      const stepData = data.step_by_step || data.steps || data.data || (Array.isArray(data) ? data : []);
      
      if (!stepData || stepData.length === 0) {
        alert("Không nhận được dữ liệu bước thực hiện.");
        setLoading(false);
        return;
      }

      setSteps(stepData);
      setArray(stepData[0].array);
      setCurrentStep(0);
      setIsRunning(true);
    } catch (error) {
      if (error.response && error.response.status === 401 && token) {
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

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
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
    infoLoading,
    sortOrder,
    setSortOrder,
    speed,
    setSpeed,
    runAlgorithm,
    reset,
    freeUsageCount,
    algorithmInfo,
    generateRandomArray,
    toggleSortOrder,
  };

  return (
    <SortingContext.Provider value={value}>
      {children}
    </SortingContext.Provider>
  );
};