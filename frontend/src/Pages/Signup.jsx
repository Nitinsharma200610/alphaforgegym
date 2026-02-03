import { useState } from "react";
import "./Signup.css";
import bgImage from "../assets/login-bg.png"; // same tone wali image

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="signup-overlay"></div>

      <div className="signup-box">
        <h2>Create Account</h2>
        <p>Join AlphaForge Gym Today</p>

        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />

        {/* PASSWORD */}
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
          />
          <span
            className="eye"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button>Sign Up</button>

        <div className="login-text">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
