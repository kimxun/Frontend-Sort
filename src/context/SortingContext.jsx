import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAlgorithms, getAlgorithmSteps, getAlgorithmById } from '../services/algorithmService';

const SortingContext = createContext();

export const useSorting = () => useContext(SortingContext);

export const SortingProvider = ({ children }) => {
  const initialArray = [5, 3, 8, 1, 2];
  const [algorithms, setAlgorithms] = useState([]);
  const [algorithmId, setAlgorithmId] = useState(1);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);
  const [array, setArray] = useState(initialArray);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [speed, setSpeed] = useState(50);

  const [originalArray, setOriginalArray] = useState(initialArray);
  const [requireLogin, setRequireLogin] = useState(false);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const res = await getAlgorithms();
        setAlgorithms(res.data || []);
        if (res.data?.length > 0) {
          setAlgorithmId(res.data[0].id);
        }
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

  useEffect(() => {
    if (!localStorage.getItem("guest_id")) {
      const uuid = crypto.randomUUID ? crypto.randomUUID() : 'guest_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("guest_id", uuid);
    }
  }, []);

  const generateSteps = async () => {
    if (!array.length) return false;

    try {
      const currentAlgo = algorithms.find(algo => algo.id === algorithmId);
      let algoNameForBackend = 'quick_sort';

      if (currentAlgo && currentAlgo.name) {
        algoNameForBackend = currentAlgo.name.toLowerCase().replace(/\s+/g, '_');
      }

      const data = await getAlgorithmSteps(
        algoNameForBackend,
        array,
        sortOrder
      );

      console.log("Dữ liệu thực tế từ Flask trả về:", data);

      const stepData = data?.metrics?.steps || data?.steps || (Array.isArray(data) ? data : []);

      if (!stepData || !stepData.length) {
        console.warn("Cảnh báo: Không tìm thấy mảng các bước (steps) trong dữ liệu trả về.");
        return false;
      }

      setSteps(stepData);

      if (stepData[0] && stepData[0].array) {
        setArray(stepData[0].array);
      } else if (Array.isArray(stepData[0])) {
        setArray(stepData[0]);
      }

      setCurrentStep(0);
      setRequireLogin(false);
      return true;
    } catch (error) {
      const response = error.response;
      if (response && response.status === 401 && response.data?.error === "Free limit exceeded") {
        setRequireLogin(true);
        alert(response.data.message);
      } else {
        console.error("Lỗi hệ thống khi sắp xếp:", error);
      }
      return null;
    }
  };

  const runAlgorithm = async () => {
    const success = await generateSteps();
    if (success) {
      setIsRunning(true);
    }
  };

  const setArrayWithMemory = (newArr) => {
    setOriginalArray([...newArr]);
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    if (originalArray.length) {
      setArray([...originalArray]);
    }
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setOriginalArray([...newArray]);
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
    if (originalArray.length) {
      setArray([...originalArray]);
    }
  };

  const goToNextStep = () => {
    if (steps.length === 0) return;
    setCurrentStep((prevStep) => {
      const nextStep = prevStep + 1;
      if (nextStep < steps.length) {
        setArray(steps[nextStep].array || steps[nextStep]);
        return nextStep;
      }
      return prevStep;
    });
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
    algorithmInfo,
    generateRandomArray,
    toggleSortOrder,
    generateSteps,
    goToNextStep,       
    requireLogin,
    setRequireLogin,
    setArrayWithMemory, 
  };

  return (
    <SortingContext.Provider value={value}>
      {children}
    </SortingContext.Provider>
  );
};