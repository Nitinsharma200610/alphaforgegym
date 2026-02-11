import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h2>AlphaForge Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/add-service">Add Service</Link>
        <Link to="/admin/add-membership">Add Membership</Link>
        <Link to="/admin/users">View Users</Link>
      </nav>

      <div>
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "#ecdddd" }}>{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
