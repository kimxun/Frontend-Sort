import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Algorithm Lab</h2>
                <span>V2.0.4-STABLE</span>
            </div>

            <nav className="sidebar-menu">

                <NavLink to="/admin/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/admin/algorithms">
                    Algorithms
                </NavLink>

                <NavLink to="/admin/visualizer">
                    Visualizer
                </NavLink>

                <NavLink to="/admin/analytics">
                    Analytics
                </NavLink>

                <NavLink to="/admin/users">
                    Users
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <button className="deploy-btn">
                    + Deploy New
                </button>

                <button className="sidebar-btn">
                    Docs
                </button>

                <button className="sidebar-btn logout-btn">
                    Logout
                </button>

            </div>

        </aside>
    );
}