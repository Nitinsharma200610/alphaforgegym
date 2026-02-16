import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, hasMembership } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // SuperAdmin gets a minimal header
  if (user && user.role === "SUPERADMIN") {
    return (
      <header className="header">
        <h2>AlphaForge — SuperAdmin</h2>
        <nav>
          <Link to="/superadmin">Contact Messages</Link>
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
    );
  }

  return (
    <header className="header">
      <h2>AlphaForge</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/cards">Services</Link>
        {hasMembership && <Link to="/membership">Membership</Link>}
        {user && user.role === "USER" && (
          <Link to="/my-plans">My Plans</Link>
        )}
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About</Link>
        {user && user.role === "ADMIN" && (
          <Link to="/admin">Admin Panel</Link>
        )}
      </nav>

      <div>
        {user ? (
          <div className="after-login">
            <h3>
              Hy,  {user?.name[0]?.toUpperCase() + user.name.slice(1)}
            </h3>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
