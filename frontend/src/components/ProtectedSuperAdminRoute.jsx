import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedSuperAdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "SUPERADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedSuperAdminRoute;
