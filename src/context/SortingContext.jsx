import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getAlgorithms, getAlgorithmSteps, getAlgorithmById } from '../services/algorithmService';
import { toast } from 'react-toastify';

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
        toast.error("Không thể tải danh sách thuật toán!");
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
        toast.error("Không thể tải thông tin mô tả thuật toán!");
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
            const targetStep = steps[nextStep];
            if (targetStep && targetStep.array) {
              setArray(targetStep.array);
            } else if (Array.isArray(targetStep)) {
              setArray(targetStep);
            }
            return nextStep;
          } else {
            setIsRunning(false);
            clearInterval(timer);
            toast.success("Mô phỏng sắp xếp hoàn thành!");
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
    if (!array.length) return null;

    try {
      const currentAlgo = algorithms.find(algo => algo.id === algorithmId);
      if (!currentAlgo) return null;

      const algorithmName = currentAlgo.name.toLowerCase().replace(/\s+/g, '_');
      const data = await getAlgorithmSteps(algorithmName, array, sortOrder);

      const stepData =
        data?.metrics?.steps ||
        data?.step_by_step ||
        data?.steps ||
        (Array.isArray(data) ? data : []);

      if (!stepData.length) {
        toast.warning("Không tìm thấy các bước xử lý cho mảng này.");
        return null;
      }

      setSteps(stepData);
      setCurrentStep(0);
      setRequireLogin(false);
      
      return stepData; 
    } catch (error) {
      const response = error.response;
      if (response && response.status === 401 && response.data?.error === "Free limit exceeded") {
        setRequireLogin(true);
        toast.warn(response.data.message || "Bạn đã dùng hết 3 lượt mô phỏng miễn phí. Vui lòng đăng nhập!");
      } else {
        console.error("Lỗi hệ thống khi sắp xếp:", error);
        toast.error("Đã xảy ra lỗi kết nối với máy chủ tính toán thuật toán!");
      }
      return null;
    }
  };

  const runAlgorithm = async () => {
    setLoading(true);
    try {
      const success = await generateSteps();
      if (success) {
        setIsRunning(true);
      }
    }  finally{
      setLoading(false);
    }
  };

  const changeInputArray = (newArr) => {
    setOriginalArray([...newArr]);
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    toast.info("Đã ghi nhận mảng tùy chỉnh mới!");
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    if (originalArray.length) {
      setArray([...originalArray]);
    }
    toast.info("Đã đặt lại trạng thái ban đầu.");
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 21) + 10;
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setOriginalArray([...newArray]);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    toast.success(`Đã tạo ngẫu nhiên mảng gồm ${length} phần tử!`);
  };

  const toggleSortOrder = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(nextOrder);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    if (originalArray.length) {
      setArray([...originalArray]);
    }
    toast.info(`Chuyển sang thứ tự sắp xếp: ${nextOrder === 'asc' ? 'Tăng dần (ASC)' : 'Giảm dần (DESC)'}`);
  };

  const value = {
    algorithms,
    algorithmId,
    setAlgorithmId,
    array,
    setArray,
    changeInputArray,
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
    requireLogin,
    setRequireLogin,
  };

  return (
    <SortingContext.Provider value={value}>
      {children}
    </SortingContext.Provider>
  );
};