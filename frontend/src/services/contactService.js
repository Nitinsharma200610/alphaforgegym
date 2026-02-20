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

// Public: submit a contact message
export const submitContact = async (data) => {
    const { data: response } = await API.post("/api/contacts", data);
    return response;
};

// SuperAdmin: get all contact messages
export const getAllContacts = async () => {
    const { data } = await API.get("/api/contacts");
    return data;
};

// SuperAdmin: mark as read
export const markContactAsRead = async (id) => {
    const { data } = await API.put(`/api/contacts/${id}/read`);
    return data;
};

// SuperAdmin: delete contact
export const deleteContact = async (id) => {
    const { data } = await API.delete(`/api/contacts/${id}`);
    return data;
};
