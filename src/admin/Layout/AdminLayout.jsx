import { Outlet } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { sidebarOpen, isMobile, toggleSidebar } = useAdmin();

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} isMobile={isMobile} onClose={toggleSidebar} />
      <div className="admin-content">
        <Topbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}