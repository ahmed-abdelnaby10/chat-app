import { useContext, useEffect, useState } from "react"
import ChatContext from "../contexts/ChatContext"
import { baseURL, getRequest } from "../utils/services"

export const useFetchLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext)
    const [latestMessage, setLatestMessage] = useState(null)

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseURL}/messages/${chat?._id}`)

            if (response?.status !== "success") {
                return console.log("Error getting messages", response?.message)
            }

            setLatestMessage(response?.data?.messages[response?.data?.messages?.length - 1])
        }
        getMessages()
    }, [chat?._id, newMessage, notifications])

    return { latestMessage }
}