import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../components/Navbar.css";

const SuperAdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <header className="header">
                <h2>AlphaForge</h2>
                <nav>
                    <span style={{ color: "#ff8c00", fontWeight: 600, fontSize: "16px" }}>
                        User's Queries
                    </span>
                </nav>
                <div>
                    <div className="after-login">
                        <h3>
                            Hy, {user?.name[0]?.toUpperCase() + user.name.slice(1)}
                        </h3>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    );
};

export default SuperAdminLayout;
