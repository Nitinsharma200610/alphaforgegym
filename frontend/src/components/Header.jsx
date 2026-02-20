import { Link } from "react-router-dom";
import "../Pages/Navbar.css";
const Header = () => {
  return (
    <header className="header">
      <h2>AlphaForge</h2>

      <nav>
        <div>
        <Link to="/">Home</Link>
        <Link to="/">Services</Link>
        <Link to="/Membership">Membership</Link>
        <Link to="/Review">Contact Us</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </header>
  );
};

export default Header;

