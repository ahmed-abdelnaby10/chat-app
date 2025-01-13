import { Suspense, useCallback, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChatContext from "../contexts/ChatContext"
import { Accordion, Button, Stack } from "react-bootstrap"
import avatar from "../assets/avatar.svg"
import LoadingComponent from "../components/Loading"
import { formatMessageDate } from "../utils/dateDivider"
import { toast, Toaster } from "react-hot-toast";

export default function Friend() {
    const { friendId } = useParams()
    const { allUsers, updateCurrentChat, userChats, updateShowChatBox, handleDeleteChat, deleteChatResponse } = useContext(ChatContext)
    const navigate = useNavigate()
    
    const user = allUsers?.find((u) => u?._id === friendId)

    const username = user?.name.includes(" ") ? 
        user?.name.slice(0, user?.name.indexOf(" ")) :
        user?.name

    const ourChat = userChats?.find(c => c?.members?.includes(user?._id))

    const handleMessageButton = useCallback(() => {
        navigate("/")
        updateCurrentChat(ourChat)
        updateShowChatBox(true)
    }, [navigate, ourChat, updateCurrentChat, updateShowChatBox])
    
    const handleClearChatButton = useCallback(async () => {
        await handleDeleteChat(ourChat?._id)
        updateCurrentChat(null)
        if (deleteChatResponse?.includes("successfully")) {
            toast.success(deleteChatResponse)
        }else {
            toast.error("Can't delete this chat!")
        }
    }, [deleteChatResponse, handleDeleteChat, ourChat?._id, updateCurrentChat])

    return (
        <Stack
            direction="vertical"
            gap={3}
            className="align-items-center justify-content-start"
        >
            <Toaster 
                position="top-center"
                reverseOrder={true}
                toastOptions={{
                    // style: {
                    //     background: theme === "dark" ? '#363636' : '#fff',
                    //     color: theme === "dark" ? '#fff' : '#000',
                    // }
                }}
            />
            <Stack
                direction="vertical"
                gap={1}
                className="align-items-center justify-content-start"
            >
                <Suspense fallback={<LoadingComponent />}>
                    <img 
                        src={user?.media?.preview_url || avatar} 
                        alt="user-pic" 
                        width={150} 
                        height={150} 
                        className="friend-pic" 
                    />
                </Suspense>
                <h3 className="m-0 p-0">{user?.name}</h3>
                <p className="m-0 p-0">{user?.phone}</p>
            </Stack>
            <Stack
                direction="horizontal"
                gap={2}
                className="actions align-items-center justify-content-center"
            >
                <Button
                    className="message-action"
                    onClick={handleMessageButton}
                >
                    <i className="bi bi-chat-left-text"></i>
                    Message
                </Button>
                <Button
                    className="message-action"
                    onClick={handleClearChatButton}
                >
                    <i className="bi bi-x-octagon-fill"></i>
                    Clear chat
                </Button>
            </Stack>
            <Accordion
                className="more-about"
                flush
                as="div"
            >
                <Accordion.Item>
                    <Accordion.Header>About {username}</Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li>
                                E-mail:
                                <span>{user?.email}</span>
                            </li>
                            <li>
                                Gender:
                                <span>{user?.gender}</span>
                            </li>
                            <li>
                                Joined at:
                                <span>{formatMessageDate(user?.created_at)}</span>
                            </li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Stack>
    )
}
