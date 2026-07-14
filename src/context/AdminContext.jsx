import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../services/userService';
import { getSimulations, deleteSimulation } from '../services/simulationService';
import { getAlgorithms, createAlgorithm, deleteAlgorithm, updateAlgorithm } from '../services/algorithmService';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [users, setUsers] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userError, setUserError] = useState(null);
  const [simulationError, setSimulationError] = useState(null);
  const [algorithmError, setAlgorithmError] = useState(null);

  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  
  const [algorithmPagination, setAlgorithmPagination] = useState({});
  const [algorithmPage, setAlgorithmPage] = useState(1);

  const handleGlobalError = (err, defaultMsg, isAlgorithm = false) => {
    const errorData = err?.response?.data || {};
    const msg = errorData.message || errorData.error || err?.message || "";
    if (err?.response?.status === 500 || msg.includes("500")) {
      if (isAlgorithm) {
        toast.error("Lỗi: Slug đã tồn tại hoặc lỗi máy chủ (500)!");
      } else {
        toast.error("Lỗi máy chủ (500): Dữ liệu không hợp lệ hoặc đã tồn tại!");
      }
      return "Lỗi hệ thống (500)";
    } else {
      toast.error(msg || defaultMsg);
      return msg || defaultMsg;
    }
  };

  const fetchUsers = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await getUsers(p, limit);
      setUsers(res.data || []);
      setPagination(res.pagination || {});
      setUserError(null);
    } catch (err) {
      setUserError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const fetchSimulations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSimulations();
      setSimulations(data);
      setSimulationError(null);
    } catch (err) {
      setSimulationError(err.message || 'Không thể tải lịch sử mô phỏng');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlgorithms = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await getAlgorithms(p, limit);
      setAlgorithms(res.data || []);
      setAlgorithmPagination(res.pagination || {});
      setAlgorithmError(null);
    } catch (err) {
      setAlgorithmError(err.message || 'Không thể tải danh sách thuật toán');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchAlgorithms(algorithmPage);
  }, [algorithmPage, fetchAlgorithms]);

  const addUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      toast.success('Thêm người dùng thành công!');
      if (page === 1) {
        await fetchUsers(1);
      } else {
        setPage(1);
      }
      return newUser;
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể thêm người dùng');
      setUserError(systemMsg);
      throw err;
    }
  };

  const editUser = async (id, userData) => {
    try {
      const updated = await updateUser(id, userData);
      toast.success('Cập nhật thông tin người dùng thành công!');
      await fetchUsers(page);
      return updated;
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể cập nhật người dùng');
      setUserError(systemMsg);
      throw err;
    }
  };

  const removeUser = async (id, options = { type: 'soft' }) => {
    try {
      await deleteUser(id, options);
      toast.success(
        options.type === 'hard'
          ? 'Xóa vĩnh viễn người dùng thành công!'
          : 'Khóa tài khoản thành công!'
      );
      const isLastItemOnPage = options.type === 'hard' && users.length === 1 && page > 1;
      const targetPage = isLastItemOnPage ? page - 1 : page;
      
      if (page === targetPage) {
        await fetchUsers(page);
      } else {
        setPage(targetPage);
      }
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể xóa người dùng');
      setUserError(systemMsg);
      throw err;
    }
  };

  const addAlgorithm = async (data) => {
    try {
      const newAlgo = await createAlgorithm(data);
      toast.success('Thêm thuật toán thành công!');
      if (algorithmPage === 1) {
        await fetchAlgorithms(1);
      } else {
        setAlgorithmPage(1);
      }
      return newAlgo;
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể thêm thuật toán', true);
      setAlgorithmError(systemMsg);
      throw err;
    }
  };

  const editAlgorithm = async (id, data) => {
    try {
      const updated = await updateAlgorithm(id, data);
      toast.success('Cập nhật thuật toán thành công!');
      await fetchAlgorithms(algorithmPage);
      return updated;
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể cập nhật thuật toán', true);
      setAlgorithmError(systemMsg);
      throw err;
    }
  };

  const removeAlgorithm = async (id, options = { type: 'soft' }) => {
    try {
      await deleteAlgorithm(id, options);
      toast.success(
        options.type === 'hard'
          ? 'Xóa vĩnh viễn thuật toán thành công!'
          : 'Đã chuyển thuật toán sang trạng thái không hoạt động!'
      );
      const isLastItemOnPage =
        options.type === 'hard' && algorithms.length === 1 && algorithmPage > 1;
      const targetPage = isLastItemOnPage ? algorithmPage - 1 : algorithmPage;
      
      if (algorithmPage === targetPage) {
        await fetchAlgorithms(targetPage);
      } else {
        setAlgorithmPage(targetPage);
      }
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể xóa thuật toán');
      setAlgorithmError(systemMsg);
      throw err;
    }
  };

  const removeSimulation = async (id) => {
    try {
      await deleteSimulation(id);
      toast.success('Xóa lịch sử mô phỏng thành công!');
      await fetchSimulations();
    } catch (err) {
      const systemMsg = handleGlobalError(err, 'Không thể xóa lịch sử mô phỏng');
      setSimulationError(systemMsg);
      throw err;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchSimulations();
  }, [fetchSimulations]);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const value = {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    isMobile,
    users,
    simulations,
    algorithms,
    loading,
    userError,
    simulationError,
    algorithmError,
    fetchUsers,
    fetchSimulations,
    fetchAlgorithms,
    addUser,
    editUser,
    removeUser,
    addAlgorithm,
    editAlgorithm,
    removeAlgorithm,
    removeSimulation,
    pagination,
    page,
    setPage,
    algorithmPagination,
    algorithmPage,
    setAlgorithmPage,
    limit,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
