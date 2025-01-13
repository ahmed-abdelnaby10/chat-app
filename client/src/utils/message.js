import { axiosInstance, baseURL } from "./services";

export const updateMessage = async (messageId, data) => {
    return await axiosInstance.patch(`${baseURL}/messages/${messageId}`, data);
}

export const deleteMessage = async (messageId) => {
    return await axiosInstance.delete(`${baseURL}/messages/${messageId}`);
}

export const deleteChat = async (chatId) => {
    return await axiosInstance.delete(`${baseURL}/chats/delete/${chatId}`);
}

export const reactionToMessage = async (messageId) => {
    return await axiosInstance.patch(`${baseURL}/messages/reaction/${messageId}`);
}

export const updateMessageInState = async (updatedMessage, setMessages) => {
    setMessages((prevMessages) => {
        const targetMessageIndex = prevMessages.findIndex((msg) => msg._id === updatedMessage._id);
        if (targetMessageIndex !== -1) {
            const updatedMessages = [...prevMessages];
            updatedMessages[targetMessageIndex] = updatedMessage;
            return updatedMessages;
        }
        return prevMessages;
    });

    console.log("updated messages:", await updatedMessage);
    
};