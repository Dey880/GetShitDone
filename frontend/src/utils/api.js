import axios from 'axios';

// Keep the original URL format (HTTP) but handle CORS properly
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true
});

// No need to force HTTPS for the backend URL
api.interceptors.request.use(config => {
    // Add any request processing here if needed
    return config;
});

export default api;