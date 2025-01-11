import { axiosInstance, baseURL } from "./services";

export const loginUser = async (data) => {
    return await axiosInstance.post(`${baseURL}/auth/login`, data)
}

export const registerUser = async (data) => {
    return await axiosInstance.post(`${baseURL}/auth/register`, data)
}

export const updateUser = async (data, userId) => {
    return await axiosInstance.patch(`${baseURL}/auth/users/${userId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const changePassword = async (data, userId) => {
    return await axiosInstance.patch(`${baseURL}/auth/users/${userId}/change-password`, data);
}