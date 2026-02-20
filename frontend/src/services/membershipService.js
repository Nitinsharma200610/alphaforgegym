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

export const createMembership = async (data) => {
  const { data: response } = await API.post("/api/memberships", data);
  return response;
};

export const getAllMemberships = async (createdBy) => {
  const params = createdBy ? { createdBy } : {};
  const { data } = await API.get("/api/memberships", { params });
  return data;
};

export const getMembershipById = async (id) => {
  const { data } = await API.get(`/api/memberships/${id}`);
  return data;
};

export const updateMembership = async (id, data) => {
  const { data: response } = await API.put(`/api/memberships/${id}`, data);
  return response;
};

export const deleteMembership = async (id) => {
  const { data } = await API.delete(`/api/memberships/${id}`);
  return data;
};

export const checkoutMembership = async (membershipId, userId) => {
  const { data } = await API.post("/api/memberships/checkout", {
    membershipId,
    userId,
  });
  return data;
};

export const verifyCheckoutSession = async (sessionId) => {
  const { data } = await API.post("/api/memberships/verify-session", {
    sessionId,
  });
  return data;
};
