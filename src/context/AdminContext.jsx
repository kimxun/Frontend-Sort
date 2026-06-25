import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../services/userService';
import { getSimulations } from '../services/simulationService';
import { getAlgorithms, createAlgorithm, deleteAlgorithm, updateAlgorithm } from '../services/algorithmService';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [users, setUsers] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Tách riêng các trạng thái lỗi để tránh bị ghi đè dữ liệu chéo
  const [userError, setUserError] = useState(null);
  const [simulationError, setSimulationError] = useState(null);
  const [algorithmError, setAlgorithmError] = useState(null);

  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  
  const [algorithmPagination, setAlgorithmPagination] = useState({});
  const [algorithmPage, setAlgorithmPage] = useState(1);

  // 2. Sử dụng useCallback và xóa setPage(p) bên trong để sửa lỗi Double-Fetch
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

  // useEffect này sẽ chịu trách nhiệm chính trong việc tự động gọi API mỗi khi `page` thay đổi
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
      // Nếu đang ở trang 1 thì chủ động fetch lại, nếu ở trang khác thì quay về trang 1 (useEffect sẽ tự fetch)
      if (page === 1) {
        await fetchUsers(1);
      } else {
        setPage(1);
      }
      return newUser;
    } catch (err) {
      setUserError(err.message || 'Không thể thêm người dùng');
      throw err;
    }
  };

  const editUser = async (id, userData) => {
    try {
      const updated = await updateUser(id, userData);
      await fetchUsers(page);
      return updated;
    } catch (err) {
      setUserError(err.message || 'Không thể cập nhật người dùng');
      throw err;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      // 3. Sửa lỗi hụt trang: Kiểm tra nếu xóa item cuối cùng của trang hiện tại thì lùi trang
      const isLastItemOnPage = users.length === 1 && page > 1;
      const targetPage = isLastItemOnPage ? page - 1 : page;
      
      if (page === targetPage) {
        await fetchUsers(page);
      } else {
        setPage(targetPage);
      }
    } catch (err) {
      setUserError(err.message || 'Không thể xóa người dùng');
      throw err;
    }
  };

  const addAlgorithm = async (data) => {
    try {
      const newAlgo = await createAlgorithm(data);
      if (algorithmPage === 1) {
        await fetchAlgorithms(1);
      } else {
        setAlgorithmPage(1);
      }
      return newAlgo;
    } catch (err) {
      setAlgorithmError(err.message || 'Không thể thêm thuật toán');
      throw err;
    }
  };

  const editAlgorithm = async (id, data) => {
    try {
      const updated = await updateAlgorithm(id, data);
      await fetchAlgorithms(algorithmPage);
      return updated;
    } catch (err) {
      setAlgorithmError(err.message || 'Không thể cập nhật thuật toán');
      throw err;
    }
  };

  const removeAlgorithm = async (id) => {
    try {
      await deleteAlgorithm(id);
      const isLastItemOnPage = algorithms.length === 1 && algorithmPage > 1;
      const targetPage = isLastItemOnPage ? algorithmPage - 1 : algorithmPage;
      
      if (algorithmPage === targetPage) {
        await fetchAlgorithms(targetPage);
      } else {
        setAlgorithmPage(targetPage);
      }
    } catch (err) {
      setAlgorithmError(err.message || 'Không thể xóa thuật toán');
      throw err;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', () => {
      // Debounce hoặc bọc trong RequestAnimationFrame nếu cần tối ưu resize hơn
      handleResize();
    });
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
    // Trả về các error tương ứng với từng màn hình cụ thể
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
    pagination,
    page,
    setPage, // Nên đưa thêm các hàm set này ra ngoài để các nút Phân trang (Pagination UI) có thể gọi trực tiếp
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