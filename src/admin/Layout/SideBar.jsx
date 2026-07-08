import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; 
import { useAdmin } from "../../context/AdminContext";
import { logout } from "../../services/authService";
import { toast } from "react-toastify"; 
import {
  FiLayout,
  FiCode,
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiPlus,
  FiLogOut,
  FiHome,
  FiClock
} from "react-icons/fi";
import "./SideBar.css";

export default function Sidebar() {
  const { sidebarOpen, isMobile, closeSidebar } = useAdmin();
  const navigate = useNavigate();

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
                  navigate("/login"); 
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

  if (isMobile && !sidebarOpen) return null;

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar} />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <h2>Algorithm Visualizer</h2>
            <span>2026</span>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/admin/dashboard">
            <FiLayout size={20} />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/admin/algorithms">
            <FiCode size={20} />
            <span>Thuật toán</span>
          </NavLink>
          <NavLink to="/admin/users">
            <FiUsers size={20} />
            <span>Người dùng</span>
          </NavLink>
          <NavLink to="/admin/simulations">
            <FiClock size={20} />
            <span>Lịch sử mô phỏng</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="deploy-btn">
            <FiPlus size={20} />
            <span>Triển khai mới</span>
          </button>

          <div className="sidebar-bottom-links">
            <Link to="/" className="sidebar-btn">
              <FiHome size={20} />
              <span>Trang Chủ</span>
            </Link>
            {/* Sự kiện onClick đã được thay đổi sạch sẽ */}
            <button className="sidebar-btn logout-btn" onClick={handleLogoutConfirm}>
              <FiLogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
