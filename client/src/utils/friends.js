import { axiosInstance, baseURL } from "./services";

export const removeFriend = async (userId, friendId) => {
    return await axiosInstance.patch(`${baseURL}/auth/${userId}/remove-friend`, {friendId});
}

export const sendFriendRequest = async (userId, friendId) => {
    return await axiosInstance.patch(`${baseURL}/auth/${userId}/send-friend-request`, {friendId});
}

export const rejectFriendRequest = async (userId, friendId) => {
    return await axiosInstance.patch(`${baseURL}/auth/${userId}/reject-friend-request`, {friendId});
}

export const acceptFriendRequest = async (userId, friendId) => {
    return await axiosInstance.patch(`${baseURL}/auth/${userId}/accept-friend-request`, {friendId});
}

export const cancelFriendRequest = async (userId, friendId) => {
    return await axiosInstance.patch(`${baseURL}/auth/${userId}/cancel-friend-request`, {friendId});
}