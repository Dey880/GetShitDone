import axios from 'axios';

// Force HTTPS in production
const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_BACKEND_URL.replace('http://', 'https://')
    : process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
    baseURL,
    withCredentials: true
});

// Add request interceptor to ensure HTTPS in production
api.interceptors.request.use(config => {
    if (process.env.NODE_ENV === 'production' && config.url.startsWith('http:')) {
        config.url = config.url.replace('http:', 'https:');
    }
    return config;
});

export default api;