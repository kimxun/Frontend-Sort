import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SortingProvider } from "./context/SortingContext";
import { AdminProvider } from "./context/AdminContext";
import SortingPage from "./pages/SortingLayout/SortingPage";
import Login from "./pages/Login/Login";
import AdminLayout from "./admin/Layout/AdminLayout";
import UsersPage from "./admin/components/User/UsersPage";
import AddUser from "./admin/components/AddUser/AddUser";
import EditUser from "./admin/components/EditUser/EditUser";
import AlgorithmsPage from "./admin/components/Algorithms/AlgorithmsPage";
import AddAlgorithm from "./admin/components/Algorithms/AddAlgorithm";
import EditAlgorithm from './admin/components/Algorithms/EditAlgorithm';
import AdminRoute from "./admin/components/Route/AdminRoute";
import Forbidden from "./pages/Forbidden/Forbidden";
import Register from "./pages/Register/Register";
import DashboardPage from "./admin/components/DashboardPage/DashboardPage";
import SimulationHistoryPage from "./admin/components/SimulationHistory/SimulationHistoryPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((value) => !value);

  return (
    <BrowserRouter>
      <SortingProvider>
        <Routes>
          <Route path="/" element={<SortingPage darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/:algorithmSlug" element={<SortingPage darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/login" element={<Login darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/register" element={<Register darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/forgotpassword" element={<ForgotPassword darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/403" element={<Forbidden darkMode={darkMode} onToggleTheme={toggleTheme} />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminProvider>
                <AdminLayout darkMode={darkMode} onToggleTheme={toggleTheme} />
              </AdminProvider>
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path="algorithms" element={<AlgorithmsPage />} />
            <Route path="simulations" element={<SimulationHistoryPage />} />
            <Route path="add-algorithm" element={<AddAlgorithm />} />
            <Route path="edit-algorithm/:id" element={<EditAlgorithm />} />

          </Route>
        </Routes>
      </SortingProvider>
    </BrowserRouter>
  );
}

export default App;
