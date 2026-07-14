import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getActiveAlgorithms,
  getAlgorithmById,
  getAlgorithmSteps,
  searchAlgorithmSteps,
} from '../services/algorithmService';

const SortingContext = createContext();

export const useSorting = () => useContext(SortingContext);

export const SortingProvider = ({ children }) => {
  const [algorithms, setAlgorithms] = useState([]);
  const [algorithmId, setAlgorithmId] = useState(null);
  const [algorithmInfo, setAlgorithmInfo] = useState(null);

  const [array, setArray] = useState([5, 3, 8, 1, 2]);
  const [originalArray, setOriginalArray] = useState([5, 3, 8, 1, 2]);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  const [speed, setSpeed] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [target, setTarget] = useState(null);

  const [requireLogin, setRequireLogin] = useState(false);

  const completionToastShownRef = useRef(false);
  const previousAlgorithmIdRef = useRef(null);

  useEffect(() => {
    loadAlgorithms();
  }, []);

  useEffect(() => {
    if (!algorithmId) return;
    loadAlgorithmInfo();
  }, [algorithmId]);

  useEffect(() => {
    if (!algorithmId) return;
    if (previousAlgorithmIdRef.current === null) {
      previousAlgorithmIdRef.current = algorithmId;
      return;
    }
    if (previousAlgorithmIdRef.current !== algorithmId) {
      previousAlgorithmIdRef.current = algorithmId;
      setSteps([]);
      setCurrentStep(0);
      setIsRunning(false);
      completionToastShownRef.current = false;
      if (originalArray.length) {
        setArray([...originalArray]);
      }
    }
  }, [algorithmId, originalArray]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      if (!completionToastShownRef.current) {
        completionToastShownRef.current = true;
        const isSearch =
          algorithmInfo?.slug === 'linear-search' ||
          algorithmInfo?.slug === 'binary-search';
        toast.success(isSearch ? 'Tìm kiếm hoàn thành!' : 'Sắp xếp hoàn thành!');
      }
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, Math.max(100, 1100 - speed * 100));
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps, speed, algorithmInfo]);

  const loadAlgorithms = async () => {
    try {
      const data = await getActiveAlgorithms();
      const algorithmList = Array.isArray(data) ? data : data?.data || [];
      setAlgorithms(algorithmList);
      if (algorithmList.length > 0) {
        setAlgorithmId(algorithmList[0].id);
      }
    } catch {
      toast.error('Không thể tải danh sách thuật toán');
    }
  };

  const loadAlgorithmInfo = async () => {
    try {
      setInfoLoading(true);
      const data = await getAlgorithmById(algorithmId);
      setAlgorithmInfo(data);
    } catch {
      toast.error('Không thể tải thông tin thuật toán');
    } finally {
      setInfoLoading(false);
    }
  };

  const generateSteps = async () => {
    try {
      const currentAlgo = algorithms.find((algo) => algo.id === algorithmId);
      if (!currentAlgo) return null;

      const isSearch =
        currentAlgo?.slug === 'linear-search' ||
        currentAlgo?.slug === 'binary-search';

      if (isSearch) return null;

      if (!array.length) {
        toast.warning('Mảng rỗng, không thể tạo bước');
        return null;
      }

      const data = await getAlgorithmSteps(currentAlgo, array, sortOrder);
      const stepData = data?.step_by_step || [];

      if (!stepData.length) {
        toast.warning('Không tìm thấy các bước xử lý cho mảng này');
        return null;
      }

      setSteps(stepData);
      setCurrentStep(0);
      completionToastShownRef.current = false;
      return stepData;
    } catch (error) {
      if (error?.response?.status === 401) {
        setRequireLogin(true);
        toast.warning(error.response.data.message);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
      return null;
    }
  };

  const runAlgorithm = async () => {
    setLoading(true);
    try {
      const result = await generateSteps();
      if (result) setIsRunning(true);
    } finally {
      setLoading(false);
    }
  };

  const searchAlgorithm = async (searchValue) => {
    setLoading(true);
    try {
      const currentAlgo = algorithms.find((algo) => algo.id === algorithmId);
      if (!currentAlgo) return;
      if (!array.length) {
        toast.warning('Mảng rỗng, không thể tìm kiếm');
        return;
      }
      const data = await searchAlgorithmSteps(currentAlgo, array, searchValue);
      const stepData = Array.isArray(data?.steps)
        ? data.steps
        : data?.step_by_step || [];
      if (!stepData.length) {
        toast.warning('Không tìm thấy các bước xử lý cho mảng này');
        return;
      }
      setSteps(stepData);
      setCurrentStep(-1);
      setArray([...originalArray]);
      completionToastShownRef.current = false;
    } catch (error) {
      if (error?.response?.status === 401) {
        setRequireLogin(true);
        toast.warning(error.response.data.message);
      } else {
        toast.error('Đã xảy ra lỗi');
      }
    } finally {
      setLoading(false);
    }
  };

  const changeInputArray = (newArr) => {
    setOriginalArray([...newArr]);
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    toast.info('Đã ghi nhận mảng tùy chỉnh mới!');
  };

  const reset = () => {
    setArray([...originalArray]);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    toast.info('Đã đặt lại trạng thái ban đầu.');
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 21) + 10; 
const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setOriginalArray([...newArray]);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
  };

  const toggleSortOrder = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(nextOrder);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    if (originalArray.length) setArray([...originalArray]);
    toast.info(`Chuyển sang thứ tự sắp xếp: ${nextOrder === 'asc' ? 'Tăng dần (ASC)' : 'Giảm dần (DESC)'}`);
  };

  return (
    <SortingContext.Provider
      value={{
        algorithms,
        algorithmId,
        setAlgorithmId,
        algorithmInfo,
        array,
        setArray,
        originalArray,
        setOriginalArray,
        steps,
        setSteps,
        currentStep,
        setCurrentStep,
        isRunning,
        setIsRunning,
        loading,
        infoLoading,
        speed,
        setSpeed,
        sortOrder,
        setSortOrder,
        target,
        setTarget,
        runAlgorithm,
        searchAlgorithm,
        reset,
        generateRandomArray,
        changeInputArray,
        toggleSortOrder,
        requireLogin,
        setRequireLogin,
        generateSteps,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
};
