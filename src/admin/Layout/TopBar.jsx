import "./TopBar.css";
import {
  FiBell,
  FiSettings,
  FiMenu
} from "react-icons/fi";

import {
  getCurrentUser
} from "../../services/authService";

export default function Topbar({
  toggleSidebar,
  isMobile
}) {

  const user = getCurrentUser();

  return (

    <header className="topbar">

      <div className="topbar-left">

        {isMobile && (

          <button
            className="hamburger-btn"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} />
          </button>

        )}

        <div className="brand">
          Quản trị AlgoStudio
        </div>

        <input
          className="search-box"
          placeholder="Tìm kiếm thuật toán..."
        />

      </div>

      <div className="topbar-right">

        <button className="icon-btn">
          <FiBell />
        </button>

        <button className="icon-btn">
          <FiSettings />
        </button>

        <div className="divider"></div>

        <div className="profile">

          <div className="profile-avatar">

            {
              user?.username
                ?.charAt(0)
                ?.toUpperCase() || "Q"
            }

          </div>

          <div className="profile-info">

            <span>
              QUẢN TRỊ VIÊN
            </span>

            <strong>
              {user?.username || "Quản trị viên"}
            </strong>

          </div>

        </div>

      </div>

    </header>
  );
}