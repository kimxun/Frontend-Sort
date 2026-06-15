import "./Sidebar.css";
export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h2>AlgoStudio</h2>

                <span>v2.0.4-STABLE</span>
            </div>

            <nav className="sidebar-menu">
                <a href="/admin/dashboard" className="active">
                    Dashboard
                </a>

                <a href="/admin/algorithms">
                    Algorithms
                </a>

                <a href="/admin/users">
                    Users
                </a>

                <a href="/admin/analytics">
                    Analytics
                </a>

                <a href="/admin/history">
                    Simulations
                </a>
            </nav>

           

            <button className="logout-btn">
                Logout
            </button>
        </aside>
    );
}