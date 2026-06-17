import "./Topbar.css";
import {FiBell,FiSettings} from "react-icons/fi";

export default function Topbar() {
    return (
        <header className="topbar">

            <div className="topbar-left">

                <div className="brand">
                    AlgoStudio Admin
                </div>

                <input
                    className="search-box"
                    placeholder="Search algorithms..."
                />

            </div>

            <div className="topbar-right">

                <button className="icon-btn">
                    <FiBell size={20} />
                </button>

                <button className="icon-btn">
                    <FiSettings size={20} />
                </button>

                <div className="divider"></div>

                <div className="profile">

                    <div className="profile-avatar">
                        A
                    </div>

                    <div className="profile-info">
                        <span>ADMIN</span>
                        <strong>Alex Dev</strong>
                    </div>

                </div>

            </div>

        </header>
    );
}