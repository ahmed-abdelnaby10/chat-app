import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { baseURL, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client"   
import { useMutation, useQuery, useQueryClient } from "react-query"
import { getSotredUserChats } from "../utils/getUserChats";
import { deleteChat, deleteMessage, reactionToMessage, updateMessage } from "../utils/message";
import { useSelector } from "../lib/rtk/index";

const ChatContext = createContext()

export const ChatContextProvider = ({ children, user }) => {
    const socketRef = useRef(null);
    const queryClient = useQueryClient()
    const isAuthenticated = useSelector(state => state.isAuthenticated)

    const [userChats, setUserChats] = useState(null)
    const [isUserChatsError, setIsUserChatsError] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(true)
    const [potentialChats, setPotentialChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [isMessagesError, setIsMessagesError] = useState(null)
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [isSendTextMessageLoading, setIsSendTextMessageLoading] = useState(false)
    const [isSendTextMessageError, setIsSendTextMessageError] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const [editedMessage, setEditedMessage] = useState(null)
    const [reactedMessage, setreactedMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notifications, setNotifications] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [showChatBox, setShowChatBox] = useState(false);
    const [deleteChatResponse, setDeleteChatResponse] = useState("")

    // Initialize Socket
    useEffect(()=> {
        const socketURL = import.meta.env.VITE_SOCKET_SERVER_URL
        socketRef.current = io(socketURL, {
            reconnection: true,
            reconnectionAttempts: 5
        });

        return () => {
            socketRef.current.disconnect();
        }
    }, [])

    // Add online users 
    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.emit("addNewUser", user?._id)
    }, [user?._id])

    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.on("getOnlineUsers", (res) => {
            setOnlineUsers(res)
        })

        return () => {
            socketRef.current.off("getOnlineUsers")
        }
    }, [user])

    // Send Message
    useEffect(() => {
        if (socketRef.current === null) return

        const recipientId = currentChat?.members?.find((id) => id !== user?._id)

        socketRef.current.emit("sendMessage", {...newMessage, recipientId})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage])

    // Edit Message 
    useEffect(() => {
        if (socketRef.current === null) return

        const recipientId = currentChat?.members?.find((id) => id !== user?._id)

        socketRef.current.emit("editMessage", {...editedMessage, recipientId})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editedMessage])

    // React to Message 
    useEffect(() => {
        if (socketRef.current === null) return

        const recipientId = currentChat?.members?.find((id) => id === user?._id)

        socketRef.current.emit("reactToMessage", {...reactedMessage, recipientId})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reactedMessage])
    
    // Recieve Edited Message
    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.on("getEditedMessage", (res)=> {
            setMessages((prevMessages) => {
                const targetMessageIndex = prevMessages?.findIndex((msg) => msg?._id === res?._id);
    
                if (targetMessageIndex !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[targetMessageIndex] = res;
                    return updatedMessages;
                }
    
                return prevMessages;
            });
        })

        return () => {
            socketRef.current.off("getEditedMessage");
        };
    }, [editedMessage, messages])

    // Recieve reacted Message
    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.on("getReactedMessage", (res)=> {
            setMessages((prevMessages) => {
                const targetMessageIndex = prevMessages?.findIndex((msg) => msg?._id === res?._id);
    
                if (targetMessageIndex !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[targetMessageIndex] = res;
                    return updatedMessages;
                }
    
                return prevMessages;
            });
        })

        return () => {
            socketRef.current.off("getReactedMessage");
        };
    }, [reactedMessage, messages])

    // Recieve Message and notification
    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.on("getMessage", (res)=> {
            if (currentChat?._id !== res.chatId) return

            setMessages((prev) => [...prev, res]);

            setUserChats((prevChats) => {
                return prevChats.map((chat) =>
                    chat?._id === res.chatId
                        ? { ...chat, latestMessage: res }  // Update chat with the new message
                        : chat
                );
            });
        })

        socketRef.current.on("getNotification", (res)=> {
            const isChatOpen = currentChat?.members.some((id) => id === res.senderId)

            if (isChatOpen) {
                setNotifications((prev) => [
                    { ...res, isRead: true },
                    ...prev
                ])
            } else {
                setNotifications((prev) => [
                    res,
                    ...prev
                ])
            }

        })

        return () => {
            socketRef.current.off("getMessage")
            socketRef.current.off("getNotification")
        }
    }, [currentChat])

    // Get all users 
    const { data: allUsersData } = useQuery({
        queryKey: ['allUsers'],
        queryFn: () => getRequest(`${baseURL}/auth/users`),
        onSuccess: async (res) => {
            setAllUsers(res?.data?.users)           
        },
        onError: (error) => {
            const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
            console.error(errorMessage);
        },
        keepPreviousData: true,
        enabled: Boolean(isAuthenticated) 
    })

    // get potential chats
    useEffect(() => {
        if (!user?._id) return;

        const pChats = allUsersData?.data?.users?.filter((u) => {
            let isChatCreated = false  

            if (user?._id === u._id) return false

            if (userChats) {
                isChatCreated = userChats?.some((chat) => {
                    return chat.members[0] === u._id || chat.members[1] === u._id
                })
            }

            return !isChatCreated;
        })

        setPotentialChats(pChats)

        queryClient.invalidateQueries(['allUsers'])
    }, [allUsersData?.data?.users, queryClient, user?._id, userChats])

    // get user chats data
    const { data: userChatsData } = useQuery({
        queryKey: ['userChats'],
        queryFn: () => getRequest(`${baseURL}/chats/${user?._id}`),
        onSuccess: async (res) => {
            setIsUserChatsLoading(false)
            setIsUserChatsError(null)

            const sortedUserChats = await getSotredUserChats(res?.data?.chats)
            setUserChats(sortedUserChats)            
        },
        onError: () => {
            setIsUserChatsError(userChatsData?.data?.message)
        },
        keepPreviousData: true,
        enabled: Boolean(isAuthenticated)
    })

    useEffect(() => {
        queryClient.invalidateQueries(['userChats'])        
    }, [queryClient, notifications, newMessage])

    // get Messages
    const { data: messagesData } = useQuery({
        queryKey: ['messages'],
        queryFn: () => getRequest(`${baseURL}/messages/${currentChat?._id}`),
        onSuccess: async (res) => {
            setIsMessagesLoading(false)
            setIsMessagesError(null)

            setMessages(res?.data?.messages)          
        },
        onError: () => {
            setIsMessagesError(messagesData?.data?.message)
        },
        keepPreviousData: true,
        enabled: Boolean(isAuthenticated && currentChat)
    })
    useEffect(()=> {
        queryClient.invalidateQueries('messages')
    }, [currentChat, queryClient])

    // Send text message
    const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
        if(!textMessage) return console.log("You must type something.")
        
        setIsSendTextMessageLoading(true)
        setIsSendTextMessageError(null)

        const body = {
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }
        const response = await postRequest(`${baseURL}/messages`, body)

        setIsSendTextMessageLoading(false)

        if (response?.status !== "success") {
            return setIsSendTextMessageError(response?.message)
        }

        setNewMessage(response?.data?.message)
        setMessages((prev) => [...prev, response?.data?.message])
        setTextMessage("")

    }, [])

    // Mutation Edit text message
    const { mutate: editMessage, isLoading: editMessageLoading, isError: editMessageError } = useMutation({
        mutationFn: ({ messageId, data }) => updateMessage(messageId, data),
        onSuccess: (res) => {            
            setEditedMessage(res.data.data.message)
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!"
            console.error(errorMessage)
        }
    })

    // add or remove reaction to a message
    const { mutate: reactionMessage, isLoading: reactionMessageLoading, isError: reactionMessageError } = useMutation({
        mutationFn: ({ messageId }) => reactionToMessage(messageId),
        onSuccess: (res) => {            
            setreactedMessage(res.data.data.message)
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!"
            console.error(errorMessage)
        }
    })

    // update current chat
    const updateCurrentChat = useCallback((chat)=> {
        setCurrentChat(chat)
    }, [])
    
    // create a new chat
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${baseURL}/chats`, JSON.stringify({
            firstId,
            secondId
        }))

        if (response?.status !== "success") {
            return console.error("Error creating chat", response?.message)
        }

        queryClient.invalidateQueries(['userChats'])
    }, [queryClient])

    const handleDeleteMessage = useCallback(async (messageId) => {
        try {
            await deleteMessage(messageId)
            queryClient.invalidateQueries({
                queryKey: ["messages"],
            });
            queryClient.invalidateQueries(['userChats'])
            
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
            console.error(errorMessage);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDeleteChat = useCallback(async (chatId) => {
        try {
            const response = await deleteChat(chatId)
            queryClient.invalidateQueries(['userChats'])
            if (currentChat?._id === chatId) {
                updateCurrentChat(null)
            }
            setDeleteChatResponse(response?.data?.message)
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again.';
            console.error(errorMessage);
            setDeleteChatResponse(errorMessage)
        }
    }, [currentChat?._id, queryClient, updateCurrentChat])

    // Update show chat box state for small screens
    const updateShowChatBox = useCallback((value)=> {
        setShowChatBox(value)
    }, [])

    // mark All Notifications As Read
    const markAllNotificationsAsRead = useCallback((notifications) => {
        const modifiedNotifications = notifications.map((n) => {
            return {
                ...n,
                isRead: true
            }
        })

        setNotifications(modifiedNotifications)
    }, [])

    // mark Notification As Read
    const markNotificationAsRead = useCallback((targetNotification, userChats, user, notifications) => {
        const desiredChat = userChats?.find((caht) => {
            const chatMembers = [user?._id, targetNotification.senderId]
            const isDesiredChat = caht?.members.every((member) => {
                return chatMembers.includes(member)
            })

            return isDesiredChat
        })

        const modifiedNotifications = notifications.map((n) => {
            if (n.senderId === targetNotification.senderId) {
                return { ...targetNotification, isRead: true }
            } else {
                return n;
            }
        })

        updateCurrentChat(desiredChat)
        setNotifications(modifiedNotifications)
        updateShowChatBox(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateCurrentChat])

    // update Online Users After Logout
    const updateOnlineUsersAfterLogout = useCallback((user) => {
        if (socketRef.current && user?._id) {
            socketRef.current.emit("logout");
            socketRef.current.disconnect();
        }
    }, []);

    // mark This User Notifications
    const markThisUserNotifications = useCallback((thisUserNotifications, notifications) => {
        const modifiedNotifications = notifications.map((el) => {

            let notification;

            thisUserNotifications.forEach((n) => {
                if (n.senderId === el.senderId) {
                    notification = { ...n, isRead: true }
                } else {
                    notification = el
                }
            })

            return notification
        })

        setNotifications(modifiedNotifications)
    }, [])

    return (
        <ChatContext.Provider
            value={{ 
                userChats,
                isUserChatsError,
                isUserChatsLoading,
                potentialChats,
                createChat,
                updateCurrentChat,
                currentChat,
                handleDeleteChat,
                deleteChatResponse,
                messages,
                isMessagesError,
                isMessagesLoading,
                newMessage,
                sendTextMessage,
                editMessage,
                editMessageLoading,
                editMessageError,
                reactionMessage,
                reactionMessageLoading,
                reactionMessageError,
                handleDeleteMessage,
                isSendTextMessageLoading,
                isSendTextMessageError,
                onlineUsers,
                updateOnlineUsersAfterLogout,
                notifications,
                allUsers,
                markAllNotificationsAsRead,
                markNotificationAsRead,
                markThisUserNotifications,
                updateShowChatBox,
                showChatBox
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

ChatContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }),
};

export default ChatContext