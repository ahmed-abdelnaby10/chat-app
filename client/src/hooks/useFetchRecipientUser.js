import { useEffect, useState } from "react"
import { baseURL, getRequest } from "../utils/services"

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null)
    // const [error, setError] = useState(null)

    const recipientId = chat?.members?.find((id) => id !== user?._id)

    useEffect(()=> {
        const getUser = async () => {
            if(!recipientId) return;
            
            const response = await getRequest(`${baseURL}/auth/users/${recipientId}`)

            if (response?.status !== "success") {
                return console.error(response?.message)
                // return setError(response?.message)
            }

            setRecipientUser(response?.data?.user)
        }
        getUser()
    }, [recipientId])

    return { recipientUser }
}
