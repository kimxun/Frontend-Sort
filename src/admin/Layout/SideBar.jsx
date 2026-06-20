import { NavLink } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { 
  FiLayout, 
  FiCode, 
  FiBarChart2, 
  FiTrendingUp, 
  FiUsers, 
  FiPlus, 
  FiFileText, 
  FiLogOut 
} from "react-icons/fi";
import "./SideBar.css";

export default function Sidebar() {
  const { sidebarOpen, isMobile, closeSidebar } = useAdmin();

  if (isMobile && !sidebarOpen) return null;

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar} />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo">
          <h2>Algorithm Lab</h2>
          <span>V2.0.4-STABLE</span>
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
          <NavLink to="/admin/visualizer">
            <FiBarChart2 size={20} />
            <span>Trực quan hóa</span>
          </NavLink>
          <NavLink to="/admin/analytics">
            <FiTrendingUp size={20} />
            <span>Phân tích</span>
          </NavLink>
          <NavLink to="/admin/users">
            <FiUsers size={20} />
            <span>Người dùng</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <button className="deploy-btn">
            <FiPlus size={20} />
            <span>Triển khai mới</span>
          </button>
          
          <div className="sidebar-bottom-links">
            <button className="sidebar-btn">
              <FiFileText size={20} />
              <span>Tài liệu</span>
            </button>
            <button className="sidebar-btn logout-btn">
              <FiLogOut size={20} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}