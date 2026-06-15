import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <Sidebar />

            <div className="admin-content">
                <Topbar />

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}