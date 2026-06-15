import "./Topbar.css";

export default function Topbar() {
    return (
        <header className="topbar">
            <div>
                <h1>Admin Dashboard</h1>

                <p>
                    Manage algorithms and users
                </p>
            </div>

            <div className="topbar-right">
                <input
                    type="text"
                    placeholder="Search..."
                />

                <div className="profile">
                    <div className="avatar">
                        A
                    </div>

                    <div>
                        <strong>Admin</strong>

                        <p>Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}