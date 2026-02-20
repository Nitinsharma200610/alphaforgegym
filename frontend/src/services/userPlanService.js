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

export const getUserPlans = async () => {
    const { data } = await API.get("/api/user-plans");
    return data;
};

export const cleanupDuplicatePlans = async () => {
    const { data } = await API.delete("/api/user-plans/cleanup");
    return data;
};
