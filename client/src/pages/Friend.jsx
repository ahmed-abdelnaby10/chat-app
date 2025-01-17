import { Suspense, useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChatContext from "../contexts/ChatContext"
import { Accordion, Button, Stack } from "react-bootstrap"
import avatar from "../assets/avatar.svg"
import LoadingComponent from "../components/Loading"
import { formatMessageDate } from "../utils/dateDivider" 
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "../lib/rtk"
import FriendsContext from "../contexts/FriendsContext"
import Swal from 'sweetalert2'

export default function Friend() {
    const { friendId } = useParams()
    const { allUsers, updateCurrentChat, userChats, updateShowChatBox, onlineUsers, createChat, handleDeleteChat } = useContext(ChatContext)
    const { 
        mutateSendRequest,
        sendRequestLoading,
        sendRequestError,
        mutateRemoveFriend,
        removeFriendLoading,
        removeFriendError,
        mutateAcceptRequest,
        acceptRequestLoading,
        acceptRequestError,
        mutateRejectRequest,
        rejectRequestLoading,
        rejectRequestError,
        mutateCancelRequest,
        cancelRequestLoading,
        cancelRequestError
    } = useContext(FriendsContext)
    const navigate = useNavigate()

    const [isFriendRequestSent, setIsFriendRequestSent] = useState(false)
    const [isFriendRequestReceived, setIsFriendRequestReceived] = useState(false)
    const [isFriend, setIsFriend] = useState(false)

    const userFromRtk = useSelector(state => state.user)

    const friend = allUsers?.find((u) => u?._id === friendId) 
    const user = allUsers?.find((u) => u?._id === userFromRtk?._id) 

    useEffect(() => {
        if (
            user?.friends?.some((id) => id.toString() === friendId) 
            && friend?.friends?.some((id) => id.toString() === user?._id)
        ) {
            setIsFriend(true)
        }else {
            setIsFriend(false)
        }
    }, [friend, friendId, user])

    useEffect(() => {
        if (
            user?.friendRequests?.sent?.some((req) => req.user.toString() === friend?._id) &&
            friend?.friendRequests?.received?.some((req) => req.user.toString() === user?._id)
        ) {
            setIsFriendRequestSent(true);
        } else {
            setIsFriendRequestSent(false);
        }
    }, [friend, user]);

    useEffect(() => {
        if (
            user?.friendRequests?.received?.some((req) => req.user.toString() === friend?._id)
            && friend?.friendRequests?.sent?.some(req => req.user.toString() === user?._id)
        ) {
            setIsFriendRequestReceived(true)
        }else {
            setIsFriendRequestReceived(false)
        }
    }, [friend, user])

    const friendname = friend?.name.includes(" ") ? 
        friend?.name.slice(0, friend?.name.indexOf(" ")) :
        friend?.name

    const ourChat = userChats?.find(c => c?.members?.includes(friend?._id))

    const handleMessageButton = useCallback(() => {
        navigate("/")
        updateCurrentChat(ourChat)
        updateShowChatBox(true)
    }, [navigate, ourChat, updateCurrentChat, updateShowChatBox])

    useEffect(()=> {
        console.log(user?.friendRequests?.received);
    }, [user?.friendRequests?.received])
    useEffect(()=> {
        console.log(isFriendRequestReceived);
    }, [isFriendRequestReceived])

    const handleSendRequest = () => {
        try {
            mutateSendRequest({ friendId: String(friend?._id) });
            if (sendRequestError) {
                toast.error(sendRequestError)
            }else {
                toast.success("Friend request sent!");
            }
        } catch (error) {
            toast.error("Failed to send friend request!");
            console.error(error)
        }
    };

    const handleCancelRequest = () => {
        try {
            mutateCancelRequest({ friendId: String(friend?._id) });
            if (cancelRequestError) {
                toast.error(cancelRequestError)
            }else {
                toast.success("Friend request canceled!");;
            }
        } catch (error) {
            toast.error("Failed to cancel friend request!");
            console.error(error)
        }
    };

    const handleAcceptRequest = () => {
        try {
            mutateAcceptRequest({ friendId: String(friend?._id) });
            if (acceptRequestError) {
                toast.error(acceptRequestError)
            }else {
                toast.success("Friend request accepted!");
                createChat(user?._id, friend?._id)
            }
        } catch (error) {
            toast.error("Failed to accept friend request!");
            console.error(error)
        }
    };

    const handleRejectRequest = () => {
        try {
            mutateRejectRequest({ friendId: String(friend?._id) });
            if (acceptRequestError) {
                toast.error(rejectRequestError)
            }else {
                toast.success("Friend request rejected!");
            }
        } catch (error) {
            toast.error("Failed to reject friend request!");
            console.error(error)
        }
    };

    const handleRemoveFriend = () => {
        try {
            mutateRemoveFriend({ friendId: String(friend?._id) });
            if (removeFriendError) {
                toast.error(rejectRequestError)
            }else {
                toast.success("Friend removed!");
                handleDeleteChat(ourChat?._id)
            }
        } catch (error) {
            toast.error("Failed to remove friend!");
            console.error(error)
        }
    };

    useEffect(() => {
        console.log("User:", user);
        console.log("Friend:", friend);
        console.log("isFriend:", isFriend);
        console.log("isFriendRequestSent:", isFriendRequestSent);
        console.log("isFriendRequestReceived:", isFriendRequestReceived);
    }, [user, friend, isFriend, isFriendRequestSent, isFriendRequestReceived]);

    return (
        <Stack
            direction="vertical"
            gap={3}
            className="align-items-center justify-content-start"
        >
            <Toaster 
                position="top-center"
                reverseOrder={true}
            />
            <Stack
                direction="vertical"
                gap={1}
                className="align-items-center justify-content-start position-relative friend-header"
            >
                <span
                    className={`${ 
                        onlineUsers?.some((user)=> user?.userId === friend?._id) ?
                        "friend-online"
                        :""
                    }`}
                ></span>
                <Suspense fallback={<LoadingComponent />}>
                    <img 
                        src={friend?.media?.preview_url || avatar} 
                        alt="friend-pic" 
                        width={150} 
                        height={150} 
                        className="friend-pic" 
                    />
                </Suspense>
                <h3 className="m-0 p-0" style={{textTransform: "capitalize"}}>{friend?.name}</h3>
                <p className="m-0 p-0">{friend?.phone}</p>
            </Stack>
            <Stack
                direction="horizontal"
                gap={2}
                className="actions align-items-center justify-content-center"
            >
                {
                    isFriendRequestSent && !isFriend && !isFriendRequestReceived && (
                        <Button
                            className="message-action"
                            onClick={handleCancelRequest}
                            variant="danger"
                        >
                            {
                                cancelRequestLoading ? (
                                    <LoadingComponent />
                                ):(
                                    <>
                                        <i className="bi bi-x-circle-fill"></i>
                                        Cancel Request
                                    </>
                                )
                            }
                        </Button>
                    )
                }

                {
                    isFriendRequestReceived && !isFriend && (
                        <>
                            <Button
                                className="message-action"
                                onClick={handleAcceptRequest}
                                variant="success"
                            >
                                {
                                    acceptRequestLoading ? (
                                        <LoadingComponent />
                                    ):(
                                        <>
                                            <i className="bi bi-check-circle-fill"></i>
                                            Accept
                                        </>
                                    )
                                }
                            </Button>
                            <Button
                                className="message-action"
                                onClick={handleRejectRequest}
                                variant="danger"
                            >
                                {
                                    rejectRequestLoading ? (
                                        <LoadingComponent />
                                    ):(
                                        <>
                                            <i className="bi bi-x-circle-fill"></i>
                                            Reject
                                        </>
                                    )
                                }
                            </Button>
                        </>
                    )
                }

                {
                    isFriend && (
                        <>
                            <Button
                                className="message-action"
                                onClick={()=> {
                                    Swal.fire({
                                        title: `Are you sure to remove ${friendname}`,
                                        color: "#333",
                                        showCancelButton: true,
                                        confirmButtonText: "Remove",
                                        confirmButtonColor: "#dc3545",
                                        cancelButtonColor: "#333",
                                        background: "#a8a8a8"
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleRemoveFriend()
                                        }
                                    });
                                }}
                                variant="danger"
                            >
                                {
                                    removeFriendLoading ? (
                                        <LoadingComponent />
                                    ):(
                                        <>
                                            <i className="bi bi-x-circle-fill"></i>
                                            Remove Friend
                                        </>
                                    )
                                }
                            </Button>
                            <Button className="message-action" onClick={handleMessageButton}>
                                <i className="bi bi-chat-left-text"></i>
                                Message
                            </Button>
                        </>
                    )
                }

                {
                    !isFriend && !isFriendRequestSent && !isFriendRequestReceived && (
                        <Button
                            className="message-action"
                            onClick={handleSendRequest}
                            variant="success"
                        >
                            {
                                sendRequestLoading ? (
                                    <LoadingComponent />
                                ):(
                                    <>
                                        <i className="bi bi-plus-circle-fill"></i>
                                        Add Friend
                                    </>
                                )
                            }
                        </Button>
                    )
                }
            </Stack>
            <Accordion
                className="more-about"
                flush
                as="div"
                alwaysOpen={false}
            >
                <Accordion.Item>
                    <Accordion.Header>About&nbsp;<span style={{textTransform: "capitalize"}}>{friendname}</span></Accordion.Header>
                    <Accordion.Body>
                        <ul>
                            <li>
                                E-mail:
                                <span>{friend?.email}</span>
                            </li>
                            {
                                friend?.gender && (
                                    <li>
                                        Gender:
                                        <span>{friend?.gender}</span>
                                    </li>
                                )
                            }
                            <li>
                                Joined at:
                                <span>{formatMessageDate(friend?.created_at)}</span>
                            </li>
                        </ul>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Stack>
    )
}