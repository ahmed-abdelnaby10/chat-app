import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser"
import { chatPropType } from "../../types/chat";
import { userPropType } from "../../types/user";
import avatar from "../../assets/avatar.svg"
import { Suspense, useContext, useEffect, useState } from "react";
import ChatContext from "../../contexts/ChatContext";
import { getUnreadNotifications } from "../../utils/notifications"
import { formatMessageDate } from "../../utils/dateDivider"
import LoadingComponent from "../Loading";

export default function UserChat({ chat, user }) {
    const { recipientUser } = useFetchRecipientUser(chat, user)
    const { currentChat, newMessage, onlineUsers, notifications, markThisUserNotifications } = useContext(ChatContext)
    const [latestMessage, setLatestMessage] = useState(null)
    const [isOnline, setIsOnline] = useState(false)

    useEffect(() => {
        if (onlineUsers?.some((user) => user.userId === recipientUser?._id)) {
            setIsOnline(true)
        }else {
            setIsOnline(false)
        }
    }, [onlineUsers, recipientUser?._id])

    const unreadNotifications = getUnreadNotifications(notifications)

    const thisUserNotifications = unreadNotifications?.filter(n => n?.senderId === recipientUser?._id)
    
    const truncateText = (text) => {
        let shortText = text.slice(0, 20)
        if (text.length > 20) {
            shortText = shortText + "..."
        }
        return shortText
    }

    useEffect(() => {
        if (chat?._id === currentChat?._id && newMessage) {
            setLatestMessage(newMessage); // Set the latest message if it's from the current chat
        }
    }, [chat?._id, currentChat?._id, newMessage]);
    
    useEffect(() => {
        setLatestMessage(chat?.latestMessage);
    }, [chat?._id, chat?.latestMessage, currentChat?._id]);

    const userProfileURL = recipientUser?.media ? recipientUser?.media?.preview_url : avatar

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            onClick={() => {
                if (thisUserNotifications?.length !== 0) {
                    markThisUserNotifications(thisUserNotifications, notifications)
                }
            }}
        >
            <div className="d-flex">
                <div className="me-2 position-relative">
                    <Suspense fallback={<LoadingComponent />}>
                        <img 
                            src={userProfileURL} 
                            alt="avatar" 
                            height={35} 
                            width={35}
                            loading="lazy"
                            className="rounded-5"
                        />
                    </Suspense>
                    <span className={`${isOnline ? "user-online" : ""}`}></span>
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">
                        {
                            latestMessage && (
                                <span className={`${thisUserNotifications?.length > 0 && "unread-message"}`}>{truncateText(latestMessage?.text)}</span>
                            ) 
                        }
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                {
                    latestMessage && (
                        <div className="date">{formatMessageDate(latestMessage?.created_at)}</div>
                    )
                }
                {
                    thisUserNotifications?.length > 0 && (
                        <div className="this-user-notifications">{thisUserNotifications?.length}</div>
                    )
                }
            </div>
        </Stack>
    )
}

UserChat.propTypes = {
    chat: chatPropType,
    user: userPropType,
};