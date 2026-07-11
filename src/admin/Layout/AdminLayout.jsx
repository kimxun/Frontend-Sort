import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import Sidebar from "./SideBar";
import Topbar from "./TopBar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { sidebarOpen, isMobile, toggleSidebar } = useAdmin();
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

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={toggleSidebar}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((value) => !value)}
      />
      <div className="admin-content">
        <Topbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
