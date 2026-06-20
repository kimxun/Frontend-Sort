import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../../services/authService";

export default function AdminRoute({ children }) {

    const user = getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 1) {
        return <Navigate to="/403" replace />;
    }

    return children;
}