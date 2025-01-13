import { useContext, useEffect, useRef, useState } from "react"
import ChatContext from "../../contexts/ChatContext"
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser"
import LoadingComponent from "../Loading"
import { Stack } from "react-bootstrap"
import moment from "moment"
import ErrorComponent from "../Error"
import InputEmoji from 'react-input-emoji'
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import useMediaQuery from "../../hooks/useMediaQuery"
import { formatMessageDate, isNewDay } from "../../utils/dateDivider"
import CustomContextMenu from "../context menus/ContextMenu"
import { useSelector } from "../../lib/rtk/index"
import MsgContextMenu from "../context menus/MessageContextMenu"
import { useNavigate } from "react-router-dom";

export default function ChatBox({ handleCloseChat }) {
    const navigate = useNavigate()
    const {
        currentChat, 
        messages, 
        isMessagesError, 
        isMessagesLoading, 
        sendTextMessage,
        isSendTextMessageLoading, 
        editMessage,
        editMessageLoading,
        reactionMessage,
        userChats,
        updateCurrentChat
    } = useContext(ChatContext)

    const user = useSelector(state => state.user)
    const { recipientUser } = useFetchRecipientUser(currentChat, user)
    const [textMessage, setTextMessage] = useState("")
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [editingMessage, setEditingMessage] = useState(null)
    const isSmallScreen = useMediaQuery("(max-width: 1024px)")
    const messagesContainerRef = useRef()
    const messageInputRef = useRef()
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [msgContextMenu, setMsgContextMenu] = useState({ visible: false, x: 0, y: 0 });

    useEffect(() => {
        if (isAutoScroll && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [isAutoScroll, messages]);

    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
            setIsAutoScroll(isAtBottom);
        }
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setMsgContextMenu({ visible: false, x: 0, y: 0 });
        setContextMenu({
            visible: true,
            x: e.pageX - 135,
            y: e.pageY - 86,
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0 })
        handleCloseChat()
    };

    const handleMsgContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({ visible: false, x: 0, y: 0 });
        setMsgContextMenu({
            visible: true,
            x: e.pageX - 135,
            y: e.pageY - 86,
        });        
    };

    const closeMsgContextMenu = () => {
        setMsgContextMenu({ visible: false, x: 0, y: 0 })
    };

    const handleSubmitMessage = () => {
        if (editingMessage) {
            if (textMessage.trim() !== editingMessage.text.trim()) {
                editMessage({
                    messageId: editingMessage?._id,
                    data: {
                        text: textMessage.trim()
                    }
                });
            }
            setEditingMessage(null);
        } else if (textMessage.trim()) {
            sendTextMessage(textMessage.trim(), user, currentChat._id, setTextMessage);
        }
        setTextMessage("");
    };

    const handleEditMessage = (message) => {
        setEditingMessage(message);
        setTextMessage(message.text);
        messageInputRef.current.focus();
    };
    const handleReactToMessage = (message) => {
        if (message?.senderId !== user?._id) {
            reactionMessage({
                messageId: message?._id
            })
        }else {
            console.warn("You can only react to messages you received.");
            return false;
        }
    };

    useEffect(() => {
        const ids = userChats?.map((chat) => {
            return chat._id
        })
        if (!ids?.includes(currentChat?._id)) {
            updateCurrentChat(null)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userChats])

    if (!recipientUser || !currentChat) {
        return (
            <div 
                className={`
                    ${isSmallScreen ? "w-100" : 'w-50'}
                    chat-box position-sticky d-flex justify-content-center
                `} 
                style={{ 
                    top: "84px", 
                    height: "100vh" 
                }}
            >
                <p className='text-center mt-5'>
                    No conversation selected yet...
                </p>
            </div>
        )
    }
    if (isMessagesError) {
        return (
            <ErrorComponent />
        )
    }
    
    return (
        <>
            <Stack gap={4} className={`${isSmallScreen ? "w-100" : 'w-50'} chat-box position-sticky`} style={{ top: "84px" }}>
                <div className="chat-header">
                    {
                        isSmallScreen && (
                            <button className="close-chat-btn" onClick={handleCloseChat}>
                                <i className="bi bi-arrow-left-short" ></i>
                            </button>
                        )
                    }
                    <div
                        role="button"
                        className="friend-name"
                        onClick={() => {
                            navigate(`/friend/${recipientUser?._id}`)
                        }}
                    >
                        <h6 className="m-0 p-0">{recipientUser.name}</h6>
                    </div>
                </div>
                <Stack 
                    gap={3} 
                    className={`${isMessagesLoading && "d-flex align-items-center justify-content-center"} messages`} 
                    ref={messagesContainerRef} 
                    onScroll={handleScroll}
                    onContextMenu={(e) => {
                        handleContextMenu(e)
                    }}
                    onClick={()=>{
                        setContextMenu({ visible: false, x: 0, y: 0 })
                        setMsgContextMenu({ visible: false, x: 0, y: 0 })
                    }}
                >
                    {
                        !isMessagesLoading ?
                            messages?.length > 0 ? messages?.map((message, index) => {
                                const previousMessage = messages[index - 1];
                                const showDateDivider = isNewDay(message, previousMessage);
                                return (
                                    <div key={index} className="d-flex flex-column">
                                        {showDateDivider && (
                                            <div className="date-divider">
                                                {formatMessageDate(message.created_at)}
                                            </div>
                                        )}
                                        <Stack 
                                            key={index} 
                                            className={`${
                                                message?.senderId === user?._id
                                                ? "message self align-self-end flex-grow-0"
                                                : "message align-self-start flex-grow-0"
                                            } position-relative`}
                                            onDoubleClick={()=> {handleReactToMessage(message)}}
                                            onContextMenu={(e) => {
                                                e.stopPropagation();
                                                setSelectedMessage(message)
                                                handleMsgContextMenu(e)
                                            }}
                                            onClick={()=>{setMsgContextMenu({ visible: false, x: 0, y: 0 })}}
                                        >
                                            <span className="message-text">{message.text}</span>
                                            <div className={`d-flex align-items-center gap-2 ${message?.edited ? "justify-content-between" : "justify-content-end"} w-100`}>
                                                {
                                                    message?.edited && (
                                                        <span 
                                                            className="message-footer"
                                                            style={{
                                                                color: message?.senderId === user?._id
                                                                ? "rgb(80, 80, 80)"
                                                                : "rgb(140, 140, 140)"
                                                            }}
                                                        >
                                                            Edited
                                                        </span>
                                                    )
                                                }
                                                <span
                                                    className="message-footer"
                                                    style={{
                                                        color: message?.senderId === user?._id
                                                        ? "rgb(80, 80, 80)"
                                                        : "rgb(140, 140, 140)"
                                                    }}
                                                >
                                                    {moment(message.created_at).format("hh:mmA")}
                                                </span>
                                            </div>
                                            {
                                                message?.senderId === user?._id && (
                                                    <i 
                                                        className="bi bi-pencil"
                                                        onClick={() => {
                                                            handleEditMessage(message)
                                                        }}
                                                    ></i>
                                                )
                                            }
                                            {
                                                message?.reacted && (
                                                    <i 
                                                        className="bi bi-heart-fill text-danger reaction-message"
                                                        style={{
                                                            left: message?.senderId === user?._id ? "-8px" : "auto",
                                                            right: message?.senderId === user?._id ? "auto" : "-8px",
                                                        }}
                                                    ></i>
                                                )
                                            }
                                        </Stack>
                                    </div>
                                )
                            }) : (
                                <p style={{ textAlign: "center", width: "100%" }}>
                                    Start a conversation now!
                                </p>
                            ) 
                        : (
                            <LoadingComponent />
                        )
                    }
                </Stack>
                <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                    <InputEmoji 
                        ref={messageInputRef}
                        value={textMessage} 
                        onChange={setTextMessage} 
                        borderColor="rgba(72, 112, 223, 0.2)"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                // sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
                                handleSubmitMessage()
                            }
                        }}
                        onBlur={() => {
                            if (!editingMessage || textMessage.trim() === editingMessage.text.trim()) {
                                setEditingMessage(null);
                                setTextMessage("");
                            }
                        }}
                    />
                    <button 
                        className="send-btn" 
                        onClick={()=> {
                            handleSubmitMessage()
                        }}
                    >
                        {
                            isSendTextMessageLoading || editMessageLoading ? (
                                <Spinner animation="border" role="status" style={{ width: "1.5rem", height: "1.5rem" }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            ):(
                                <i className="bi bi-send-fill"></i>
                            )
                        }
                    </button>
                </Stack>
            </Stack>
            {
                (contextMenu.visible && !isSmallScreen) && (
                    <CustomContextMenu contextMenu={contextMenu} closeContextMenu={closeContextMenu} />
                )
            }
            {
                (msgContextMenu.visible) && (
                    <MsgContextMenu contextMenu={msgContextMenu} closeContextMenu={closeMsgContextMenu} selectedMessage={selectedMessage} />
                )
            }
        </>
    )
}

ChatBox.propTypes = {
    handleCloseChat: PropTypes.func.isRequired,
};