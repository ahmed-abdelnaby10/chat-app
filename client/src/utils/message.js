import { axiosInstance, baseURL } from "./services";

export const updateMessage = async (messageId, data) => {
    return await axiosInstance.patch(`${baseURL}/messages/${messageId}`, data);
}

export const deleteMessage = async (messageId) => {
    return await axiosInstance.delete(`${baseURL}/messages/${messageId}`);
}

export const reactionToMessage = async (messageId) => {
    return await axiosInstance.patch(`${baseURL}/messages/reaction/${messageId}`);
}