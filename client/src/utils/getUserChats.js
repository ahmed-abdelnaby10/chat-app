
export const getSotredUserChats = (userChats) => {
    const chatsWithLatestMessages = userChats?.map((chat) => {
        const latestMessage = chat?.latestMessage || null;
        return {
            ...chat,
            latestMessageDate: latestMessage?.created_at || new Date(0), // Use a very old date if no messages exist
        };
    });

    // Sort chats based on the latest message date
    const sortedUserChats = chatsWithLatestMessages?.sort((a, b) => new Date(b?.latestMessageDate) - new Date(a?.latestMessageDate));

    return sortedUserChats
}