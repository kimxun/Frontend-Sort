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
  const [freeUsageCount, setFreeUsageCount] = useState(() => {
    return parseInt(localStorage.getItem('freeUsageCount')) || 0;
  });

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
  const generateSteps = async () => {
    if (!array.length) return false;

    const data = await getAlgorithmSteps(
      algorithmId,
      array,
      sortOrder
    );

    const stepData =
      data.step_by_step ||
      data.steps ||
      data.data ||
      (Array.isArray(data) ? data : []);

    if (!stepData.length) return false;

    setSteps(stepData);
    setArray(stepData[0].array);
    setCurrentStep(0);

    return true;
  };

  const runAlgorithm = async () => {
    setLoading(true);

    try {
      const success = await generateSteps();

      if (success) {
        setIsRunning(true);
      }
    } finally {
      setLoading(false);
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

    setOriginalArray([...newArray]); // 👈 lưu bản gốc
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


  const value = {
    algorithms,
    algorithmId,
    setAlgorithmId,
    array,
    setArray: setArrayWithMemory,
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
    generateSteps,
  };

  return (
    <SortingContext.Provider value={value}>
      {children}
    </SortingContext.Provider>
  );
};