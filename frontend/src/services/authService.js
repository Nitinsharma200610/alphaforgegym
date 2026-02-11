import axios from "axios";

const BaseURL = import.meta.env.VITE_APP_BE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BaseURL,
});

export const registerUser = async ({ name, email, password }) => {
  const { data } = await API.post("/api/users/register", { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await API.post("/api/users/login", { email, password });
  return data;
};
