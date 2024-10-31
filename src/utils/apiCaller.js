import axios from 'axios';
import { toast } from 'react-toastify';

export const proxy = process.env.NODE_ENV === 'development' ? `http://localhost:8000/api/v1` : `${process.env.REACT_APP_PROXY}/api/v1`;

const apiCaller = axios.create({
    baseURL: proxy,
});

// Add request interceptor to include token in headers
apiCaller.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors globally
apiCaller.interceptors.response.use(
    (response) => {
        const { status, message } = response.data;
        // toast.success(message || status || 'Request Successfull');
        return response.data
    },
    (error) => {
        const { status, message } = error?.response?.data || {};
        toast.error(message || status || 'An error occurred');
        return Promise.reject(error);
    }
);

export default apiCaller;
