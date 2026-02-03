import { Link } from "react-router-dom";
import "./Navbar.css";   // ✅ SAME FOLDER CSS

const Navbar = () => {
  return (
    <header className="header">
      
      <h2>AlphaForge</h2>

      <nav>

        
        <Link to="/">Home</Link>
        <Link to="/cards">Services</Link>
         <Link to="/membership">Membership</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/about">About</Link>
      
      </nav>

      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
