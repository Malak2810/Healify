// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // your backend URL
});

// Add a request interceptor to automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get token from localStorage
    if (token) {
      config.headers["x-access-token"] = token; // attach it to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
