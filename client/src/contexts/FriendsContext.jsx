import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMutation } from "react-query"
import { acceptFriendRequest, removeFriend, rejectFriendRequest, sendFriendRequest, cancelFriendRequest } from "../utils/friends";
import { useDispatch, useSelector } from "../lib/rtk";
import { setUser } from "../lib/rtk/slices/userSlice";
import ChatContext from "./ChatContext";

const FriendsContext = createContext()

export const FriendsContextProvider = ({ children }) => {
    const { socketRef, allUsers } = useContext(ChatContext)
    
    const user = useSelector(state => state.user);
    const userId = user?._id
    const updatedUser = allUsers?.find((u) => u?._id === userId) 

    const dispatch = useDispatch()

    const [sendRequestError, setSendRequestError,] = useState("")
    const [acceptRequestError, setAcceptRequestError,] = useState("")
    const [rejectRequestError, setRejectRequestError,] = useState("")
    const [cancelRequestError, setCancelRequestError,] = useState("")
    const [removeFriendError, setRemoveFriendError,] = useState("")

    const { mutate: mutateRemoveFriend, isLoading: removeFriendLoading } = useMutation({
        mutationFn: ({ friendId }) => removeFriend(userId, friendId),
        onSuccess: (res) => {
            socketRef.current.emit("removeFriend", {user: res?.data?.data?.user, friend: res?.data?.data?.friend})
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!"
            console.error(errorMessage)
            setRemoveFriendError(errorMessage)
        }
    })

    const { mutate: mutateSendRequest, isLoading: sendRequestLoading } = useMutation({
        mutationFn: ({ friendId }) => sendFriendRequest(userId, friendId),
        onSuccess: (res) => {
            socketRef.current.emit("sendFriendRequest", {user: res?.data?.data?.user, friend: res?.data?.data?.friend})
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!";
            console.error(errorMessage);
            setSendRequestError(errorMessage)
        }
    });

    const { mutate: mutateAcceptRequest, isLoading: acceptRequestLoading } = useMutation({
        mutationFn: ({ friendId }) => acceptFriendRequest(userId, friendId),
        onSuccess: (res) => {
            socketRef.current.emit("acceptFriendRequest", {user: res?.data?.data?.user, friend: res?.data?.data?.friend})
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!";
            console.error(errorMessage);
            setAcceptRequestError(errorMessage)
        }
    });

    const { mutate: mutateRejectRequest, isLoading: rejectRequestLoading } = useMutation({
        mutationFn: ({ friendId }) => rejectFriendRequest(userId, friendId),
        onSuccess: (res) => {
            socketRef.current.emit("rejectFriendRequest", {user: res?.data?.data?.user, friend: res?.data?.data?.friend})
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!";
            console.error(errorMessage);
            setRejectRequestError(errorMessage)
        }
    });

    const { mutate: mutateCancelRequest, isLoading: cancelRequestLoading } = useMutation({
        mutationFn: ({ friendId }) => cancelFriendRequest(userId, friendId),
        onSuccess: (res) => {
            socketRef.current.emit("cancelFriendRequest", {user: res?.data?.data?.user, friend: res?.data?.data?.friend})
        },
        onError: (error) => {
            const errorMessage = error.response.data.message || "Something went wrong!";
            console.error(errorMessage);
            setCancelRequestError(errorMessage)
        }
    });

    useEffect(() => {
        if (socketRef.current === null) return

        socketRef.current.on("updateFriendRequests", (data) => {
            const newUserState = {
                ...user,
                friendRequests: {
                    sent: data.sent || user.friendRequests.sent,
                    received: data.received || user.friendRequests.received,
                },
                friends: updatedUser?.friends || user.friends
            }
            dispatch(setUser(newUserState))
        })
    }, [dispatch, socketRef, updatedUser?.friends, user])

    return (
        <FriendsContext.Provider
            value={{ 
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
                cancelRequestError,
            }}
        >
            {children}
        </FriendsContext.Provider>
    )
}

FriendsContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default FriendsContext