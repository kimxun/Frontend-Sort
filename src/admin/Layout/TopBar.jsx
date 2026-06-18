import "./TopBar.css";
import { FiBell, FiSettings, FiMenu } from "react-icons/fi";

export default function Topbar({ toggleSidebar, isMobile }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {isMobile && (
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
        )}
        <div className="brand">AlgoStudio Admin</div>
        <input className="search-box" placeholder="Search algorithms..." />
      </div>

      <div className="topbar-right">
        <button className="icon-btn"><FiBell /></button>
        <button className="icon-btn"><FiSettings /></button>
        <div className="divider"></div>
        <div className="profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <span>ADMIN</span>
            <strong>Alex Dev</strong>
          </div>
        </div>
      </div>
    </header>
  );
}