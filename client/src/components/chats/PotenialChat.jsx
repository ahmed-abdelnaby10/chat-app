import PropTypes from "prop-types"
import { Stack } from "react-bootstrap"
import { useSelector } from "../../lib/rtk"
import { Suspense, useContext } from "react"
import ChatContext from "../../contexts/ChatContext"
import LoadingComponent from "../Loading"
import avatar from "../../assets/avatar.svg"

export default function PotenialChat({ show, handleClose }) {
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext)
    const user = useSelector(state => state.user)

    if (show)
    return (
        <>
            <Stack 
                direction="vertical"
                className="messages-box position-relative potenial-chats"
            >
                {
                    potentialChats?.length === 0 ? (
                        <span className="text-center mt-3">There is no contacts</span>
                    ) :
                    potentialChats?.map((u, i) => {
                        return (
                            <Stack 
                                key={i} 
                                className="user-card align-items-center justify-content-start"
                                role="button" 
                                direction="horizontal"
                                gap={3}
                                onClick={()=> {
                                    createChat(user?._id, u?._id)
                                    handleClose()
                                }}
                            >
                                <div className="position-relative">
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
                                    <span
                                        className={`${ 
                                            onlineUsers?.some((user)=> user?.userId === u?._id) ?
                                            "user-online position-absolute"
                                            :""
                                        }`}
                                    ></span>
                                </div>
                                <span className="single-user-">{u?.name}</span>
                            </Stack>
                        )
                    })
                }
            </Stack>
        </>
    )
}

PotenialChat.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};