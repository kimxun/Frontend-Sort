import React, { createContext, useState, useEffect, useContext } from 'react';
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
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [algorithmPagination, setAlgorithmPagination] = useState({});
  const [algorithmPage, setAlgorithmPage] = useState(1);
  const fetchUsers = async (p = page) => {
    setLoading(true);
    try {
      const res = await getUsers(p, limit);

      setUsers(res.data || []);
      setPagination(res.pagination || {});
      setPage(p);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const data = await getSimulations();
      setSimulations(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử mô phỏng');
    } finally {
      setLoading(false);
    }
  };

  // const fetchAlgorithms = async ( p) => {
  //   setLoading(true);
  //   try {
  //     const data = await getAlgorithms();
  //     setAlgorithms(data.filter(a => a.status !== -1));
  //     setError(null);
  //   } catch (err) {
  //     setError(err.message || 'Không thể tải danh sách thuật toán');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchAlgorithms = async (p = page) => {
    setLoading(true);

    try {
      const res = await getAlgorithms(p, limit);

      setAlgorithms(
        (res.data || [])
      );

      setAlgorithmPagination(res.pagination || {});
      setAlgorithmPage(p);

      setError(null);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách thuật toán');
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchAlgorithms(page);
  // }, [page]);

  const addUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err.message || 'Không thể thêm người dùng');
      throw err;
    }
  };

  const editUser = async (id, userData) => {
    try {
      const updated = await updateUser(id, userData);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      return updated;
    } catch (err) {
      setError(err.message || 'Không thể cập nhật người dùng');
      throw err;
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message || 'Không thể xóa người dùng');
      throw err;
    }
  };

  const addAlgorithm = async (data) => {
    try {
      const newAlgo = await createAlgorithm(data);
      setAlgorithms(prev => [...prev, newAlgo]);
      return newAlgo;
    } catch (err) {
      setError(err.message || 'Không thể thêm thuật toán');
      throw err;
    }
  };

  const editAlgorithm = async (id, data) => {
    try {
      const updated = await updateAlgorithm(id, data);
      setAlgorithms(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      setError(err.message || 'Không thể cập nhật thuật toán');
      throw err;
    }
  };

  const removeAlgorithm = async (id) => {
    try {
      await deleteAlgorithm(id);
      setAlgorithms(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message || 'Không thể xóa thuật toán');
      throw err;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchSimulations();
    fetchAlgorithms();
  }, []);

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
    error,
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
    algorithmPagination,
    algorithmPage,
    limit,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};