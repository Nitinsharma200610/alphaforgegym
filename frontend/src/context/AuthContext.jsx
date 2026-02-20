import { useState, useCallback } from "react";
import AuthContext from "./authContextDef";
import { getCurrentUser } from "../services/userService";

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (userData) => {
    const { token: authToken, ...rest } = userData;
    setUser(rest);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(rest));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    try {
      const { user: userData } = await getCurrentUser();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  }, [token]);

  // Check if user has active membership
  const hasMembership =
    user?.subscription?.status === "active" &&
    user?.subscription?.membershipId != null;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, refreshUser, hasMembership }}
    >
      {children}
    </AuthContext.Provider>
  );
};

