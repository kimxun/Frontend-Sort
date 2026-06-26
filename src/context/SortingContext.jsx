import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getActiveAlgorithms, getAlgorithmSteps, getAlgorithmById } from '../services/algorithmService';
import { toast } from 'react-toastify';

const SortingContext = createContext();
const RESERVED_PATHS = new Set(['admin', 'login', 'register', '403']);

const getAlgorithmSlugFromPath = (pathname) => {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  if (!firstSegment || RESERVED_PATHS.has(firstSegment)) return null;
  return firstSegment;
};

export const useSorting = () => useContext(SortingContext);

export const SortingProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const completionToastShownRef = useRef(false);
  const previousAlgorithmIdRef = useRef(null);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const res = await getActiveAlgorithms();
        const activeAlgorithms = Array.isArray(res) ? res : res.data || [];
        setAlgorithms(activeAlgorithms);
        if (activeAlgorithms.length > 0) {
          const slugFromPath = getAlgorithmSlugFromPath(location.pathname);
          const algorithmFromPath = activeAlgorithms.find((algo) => algo.slug === slugFromPath);
          setAlgorithmId((algorithmFromPath || activeAlgorithms[0]).id);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải danh sách thuật toán!");
      }
    };
    fetchAlgorithms();
  }, []);

  useEffect(() => {
    if (!algorithms.length || !algorithmId) return;

    const selectedAlgorithm = algorithms.find((algo) => algo.id === algorithmId);
    if (!selectedAlgorithm?.slug) return;

    const firstSegment = location.pathname.split('/').filter(Boolean)[0];
    const isSortingPath = location.pathname === '/' || !RESERVED_PATHS.has(firstSegment);
    if (!isSortingPath) return;

    if (getAlgorithmSlugFromPath(location.pathname) !== selectedAlgorithm.slug) {
      navigate(`/${selectedAlgorithm.slug}`, { replace: true });
    }
  }, [algorithmId, algorithms, location.pathname, navigate]);

  useEffect(() => {
    if (!algorithms.length) return;

    const slugFromPath = getAlgorithmSlugFromPath(location.pathname);
    if (!slugFromPath) return;

    const algorithmFromPath = algorithms.find((algo) => algo.slug === slugFromPath);
    if (algorithmFromPath) {
      setAlgorithmId((currentAlgorithmId) =>
        algorithmFromPath.id !== currentAlgorithmId
          ? algorithmFromPath.id
          : currentAlgorithmId
      );
    }
  }, [location.pathname, algorithms]);

  useEffect(() => {
    const fetchAlgorithmInfo = async () => {
      if (!algorithmId) return;
      setInfoLoading(true);
      try {
        const data = await getAlgorithmById(algorithmId);
        setAlgorithmInfo(data);
      } catch (error) {
        console.error(error);
        setAlgorithmInfo(null);
        toast.error("Không thể tải thông tin mô tả thuật toán!");
      } finally {
        setInfoLoading(false);
      }
    };
    fetchAlgorithmInfo();
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

  // Bộ đếm tự động chạy Animation
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      if (!completionToastShownRef.current) {
        completionToastShownRef.current = true;
        toast.success("Mô phỏng sắp xếp hoàn thành!");
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      const targetStep = steps[nextStep];

      // Đọc an toàn cho cả dạng Object {array} lẫn mảng thuần [1,2,3]
      if (targetStep && targetStep.array) {
        setArray(targetStep.array);
      } else if (Array.isArray(targetStep)) {
        setArray(targetStep);
      }

      setCurrentStep(nextStep);
    }, Math.max(50, 1000 - speed * 8));

    return () => clearTimeout(timer);
  }, [isRunning, steps, speed, currentStep]);



  // Hàm nạp các bước từ API Backend
  const generateSteps = async () => {
    if (!array.length) return null;

    try {
      const currentAlgo = algorithms.find(algo => algo.id === algorithmId);
      if (!currentAlgo) return null;

      const data = await getAlgorithmSteps(currentAlgo, array, sortOrder);

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
      completionToastShownRef.current = false;
      setRequireLogin(false);
      
      return stepData; // Trả về danh sách để hỗ trợ nút bấm thủ công di chuyển ngay lập tức
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
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý RIÊNG khi người dùng tự nhập mảng bằng tay
  const changeInputArray = (newArr) => {
    setOriginalArray([...newArr]);
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    toast.info("Đã ghi nhận mảng tùy chỉnh mới!");
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
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
    completionToastShownRef.current = false;
    toast.success(`Đã tạo ngẫu nhiên mảng gồm ${length} phần tử!`);
  };

  const changeAlgorithmId = (nextAlgorithmId) => {
    setAlgorithmId(nextAlgorithmId);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    if (originalArray.length) {
      setArray([...originalArray]);
    }
  };

  const toggleSortOrder = () => {
    const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(nextOrder);
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    completionToastShownRef.current = false;
    if (originalArray.length) {
      setArray([...originalArray]);
    }
    toast.info(`Chuyển sang thứ tự sắp xếp: ${nextOrder === 'asc' ? 'Tăng dần (ASC)' : 'Giảm dần (DESC)'}`);
  };

  const value = {
    algorithms,
    algorithmId,
    setAlgorithmId: changeAlgorithmId,
    array,
    setArray,             // Trả về hàm set thuần túy của React để chạy mượt
    changeInputArray,     // Hàm riêng dành cho ô Input dữ liệu
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
