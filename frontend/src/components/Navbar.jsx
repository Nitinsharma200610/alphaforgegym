import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css"; // ✅ SAME FOLDER CSS

const Navbar = () => {
  const { user, logout, hasMembership } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


 
  return (
    <header className="header">
      <h2>AlphaForge</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/cards">Services</Link>
        {!hasMembership && <Link to="/membership">Membership</Link>}
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About</Link>
      </nav>

      <div>
        {user ? (
          <div className="after-login">
          <h3>
           Hy,  { user?.name[0].toUpperCase()+ user.name.slice(1)}
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
