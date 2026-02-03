import React from "react";
import "./Login.css";
import bgImage from "../assets/login-bg.png"; // yahan apni image ka path do

const Login = () => {
  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="login-overlay"></div>

      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Login to AlphaForge Gym</p>

        <form>
          <input
            type="email"
            placeholder="Email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            required
          />

          <button type="submit">Login</button>
        </form>

        <span className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </span>
      </div>
    </div>
  );
};

export default Login;
