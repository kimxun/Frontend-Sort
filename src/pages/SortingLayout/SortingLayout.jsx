import React, { useState, useEffect } from "react";
import ControlPanel from '../../components/ControlPanel/ControlPanel';
import AlgorithmInfo from '../../components/AlgorithmInfo/AlgorithmInfo';
import VariablesPanel from '../../components/VariablesPanel/VariablesPanel';
import SortingVisualizer from '../../components/SortingVisualizer/SortingVisualizer';
import CodePanel from '../../components/CodePanel/CodePanel';
import HistoryPanel from '../../components/HistoryPanel/HistoryPanel';
import './SortingLayout.css';
import { logout, getCurrentUser } from '../../services/authService';
import { toast } from 'react-toastify';
import { FaMoon, FaSun } from "react-icons/fa";



const SortingLayout = () => {
  
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

  const user = getCurrentUser();

  const handleLogoutConfirm = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="custom-confirm-toast">
          <p style={{ margin: "0 0 10px 0", fontWeight: "500", color: "#fff" }}>
            Bạn có chắc chắn muốn đăng xuất?
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={closeToast}
              style={{
                background: "#475569",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px"
              }}
            >
              Hủy
            </button>
            <button
              onClick={async () => {
                closeToast();
                try {
                  await logout();
                  toast.success("Đăng xuất thành công!");
                  window.location.href = "/login";
                } catch (err) {
                  toast.error("Đăng xuất thất bại!");
                }
              }}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        theme: "dark"
      }
    );
  };

  const renderHeader = () => (
    <div className="sorting-layout__header">
      <div className="brand-icon">
        <img src="/pufferfish.svg" alt="Logo" width="50" height="50" />
      </div>
      <div className="brand-title">
        <h1>SORTING VISUALIZER</h1>
        <p>Algorithm Animation Studio</p>
      </div>

      <div className="header-actions">
        <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
        >
            {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        {user?.role === 1 && (
          <button
            className="header-admin-btn"
            onClick={() => window.location.href = "/admin/dashboard"}
          >
            Admin
          </button>
        )}
        {user ? (
          <div className="header-user">
            <span className="header-username">
              Xin chào, {user.username}
            </span>
            <button className="header-login-btn" onClick={handleLogoutConfirm}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
            className="header-login-btn"
            onClick={() => window.location.href = "/login"}
          >
            Đăng nhập
          </button>
        )}
      </div>
      
    </div>
  );

  const renderVisualizer = () => (
    <div className="panel-window">
      <div className="panel-window__header">
        <div className="mac-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="panel-window__title">Algorithm Animation Studio</span>
      </div>
      <div className="panel-window__content">
        <SortingVisualizer />
      </div>
    </div>
  );

  const renderCodePanel = () => (
    <div className="panel-window">
      <div className="panel-window__header">
        <div className="mac-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="panel-window__title">Code Editor</span>
      </div>
      <div className="panel-window__content code-content">
        <CodePanel />
      </div>
    </div>
  );

  return (
    <div className="sorting-layout">
      {renderHeader()}

<div className="layout-desktop">

  <div className="layout-main">

    {/* Cột thông tin */}
    <aside className="layout-info">
      <AlgorithmInfo />
    </aside>

    {/* Cột giữa */}
    <div className="layout-left">
      <div className="layout-animation">
        {renderVisualizer()}
      </div>

      <ControlPanel />
    </div>

    {/* Cột phải */}
    <div className="layout-right">
      {renderCodePanel()}

      <HistoryPanel />

      <VariablesPanel />
    </div>

  </div>

</div>
    </div>
  );
};

export default SortingLayout;
