import axios from "axios";

const BaseURL = import.meta.env.VITE_APP_BE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BaseURL,
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  const { data } = await API.post("/api/users/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await API.post("/api/users/login", userData);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await API.get("/api/users/me");
  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/api/users");
  return data;
};

export const getAdminStats = async () => {
  const { data } = await API.get("/api/users/stats");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await API.get(`/api/users/${id}`);
  return data;
};

export const updateUserSubscription = async (userId, subscription) => {
  const { data } = await API.put(`/api/users/${userId}/subscription`, {
    subscription,
  });
  return data;
};
