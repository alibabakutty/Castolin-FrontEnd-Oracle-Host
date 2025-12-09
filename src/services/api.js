import axios from "axios";

// Use environment variable for API URL
const API_BASE_URL = 'https://castolin-backend-postgresql-host.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,  // ✅ Uses your Vercel backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    config => {
        console.log('API Request:', {
            url: config.baseURL + config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('API Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

export default api;