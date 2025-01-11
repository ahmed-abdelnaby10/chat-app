import { Suspense, useContext } from "react"
import ChatContext from "../../contexts/ChatContext"
import useMediaQuery from "../../hooks/useMediaQuery"
import PropTypes from "prop-types"
import { useSelector } from "../../lib/rtk/index"
import avatar from "../../assets/avatar.svg"
import LoadingComponent from "../Loading"

export default function PotenialChat({ showChatBox }) {
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext)
    const user = useSelector(state => state.user)
    
    const isSmallScreen = useMediaQuery("(max-width: 1024px)")
    return (
        <div className={`${(isSmallScreen && showChatBox) && "d-none"} all-users`}>
            {
                potentialChats && 
                potentialChats.map((u, i) => {
                    return (
                        <div key={i} className="single-user" onClick={()=> {createChat(user?._id, u?._id)}}>
                            <Suspense fallback={<LoadingComponent />}>
                                <img 
                                    src={u?.media?.preview_url || avatar} 
                                    alt="avatar" 
                                    height={35} 
                                    width={35}
                                    loading="lazy"
                                    className="rounded-5"
                                />
                            </Suspense>
                            <span className="single-user-name">{u?.name}</span>
                            <span 
                                className={`${ 
                                    onlineUsers?.some((user)=> user?.userId === u?._id) ?
                                    "user-online"
                                    :""
                                }`}
                            ></span>
                        </div>
                    )
                })
            }
        </div>
    )
}

PotenialChat.propTypes = {
    showChatBox: PropTypes.bool.isRequired,
};