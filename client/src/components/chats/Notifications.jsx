import { useContext, useState } from "react"
import ChatContext from "../../contexts/ChatContext"
import { getUnreadNotifications } from "../../utils/notifications"
import moment from "moment"
import { useSelector } from "../../lib/rtk/index"
import { useNavigate } from "react-router-dom"

export default function Notifications() {
    const { notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationAsRead } = useContext(ChatContext)
    const user = useSelector(state => state.user)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const unreadNotifications = getUnreadNotifications(notifications)

    const groupedNotifications = notifications.reduce((acc, notification) => {
        const senderId = notification.senderId;
        if (!acc[senderId]) {
            acc[senderId] = [];
        }
        acc[senderId].push(notification);
        return acc;
    }, {});


    const modifiedNotifications = Object.keys(groupedNotifications).map(senderId => {
        const notificationsForSender = groupedNotifications[senderId];
        const lastNotification = notificationsForSender[notificationsForSender.length - 1];  // Get the last notification
        const sender = allUsers.find(u => u._id === senderId);

        return {
            ...lastNotification,
            senderName: sender?.name,
            messageCount: notificationsForSender.length // Count of messages from this sender
        };
    });

    const handlePreventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();  // Stops the event from bubbling up and triggering default actions
    };

    const handleMarkAllNotifications = (e) => {
        handlePreventDefault(e)
        markAllNotificationsAsRead(notifications);
        setIsOpen(false);
    };
    
    const handleNotificationClick = (e, notification) => {
        handlePreventDefault(e)
        markNotificationAsRead(notification, userChats, user, notifications);
        setIsOpen(false);
        navigate("/")
    };

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => {setIsOpen(!isOpen)}}>
                <i className="bi bi-bell-fill"></i>
                {
                    unreadNotifications.length > 0 && (
                        <span className="notification-count">{unreadNotifications.length}</span>
                    )
                }
            </div>
            {
                isOpen && (
                    <div className="notifications-box">
                        <div className="notifications-header">
                            <h3>Notifications</h3>
                            <div 
                                className="mark-as-read"
                                onClick={handleMarkAllNotifications}
                            >
                                Mark all as read
                            </div>
                        </div>
                        {modifiedNotifications?.length === 0 ? (
                            <span className="notification">No notifications yet.</span>
                        ): modifiedNotifications.map((n, index) => {
                            return (
                                <div 
                                    key={index}
                                    className={`${n.isRead ? 'notification' : 'notification not-read'}`}
                                    onClick={(e)=>{handleNotificationClick(e, n)}}
                                >
                                    <span>{`${n.senderName} sent you ${n.messageCount} new message${n.messageCount > 1 ? 's' : ''}.`}</span>
                                    <span className="notification-time">{moment(n.date).calendar()}</span>
                                </div>
                            )
                        })
                        }
                    </div>
                )
            }
        </div>
    )
}
