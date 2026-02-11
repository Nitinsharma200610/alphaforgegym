import axios from "axios";

const BaseURL = import.meta.env.VITE_APP_BE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BaseURL,
});

export const createService = async (data) => {
  const { data: response } = await API.post("/api/services", data);
  return response;
};

export const getAllServices = async () => {
  const { data } = await API.get("/api/services");
  return data;
};

export const getServiceById = async (id) => {
  const { data } = await API.get(`/api/services/${id}`);
  return data;
};

export const updateService = async (id, data) => {
  const { data: response } = await API.put(`/api/services/${id}`, data);
  return response;
};

export const deleteService = async (id) => {
  const { data } = await API.delete(`/api/services/${id}`);
  return data;
};
