import Cookie from 'js-cookie';
import axios from 'axios';

export const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookie.get(ACCESS_TOKEN);

    if (!config.url.includes('/login') && !config.url.includes('/register') && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export const postRequest = async(url, body) => {
    try {
        const response = await axiosInstance.post(url, body)

        const data = response.data
        return data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return { error: true, message };
    }
}

export const getRequest = async(url) => {
    try {
        const response = await axiosInstance.get(url)

        const data = response.data
        return data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        return console.log(message)
    }
}