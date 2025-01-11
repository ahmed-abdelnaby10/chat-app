import { useContext, useState } from "react"
import ChatContext from "../contexts/ChatContext"
import { Container, Stack } from "react-bootstrap"
import LoadingComponent from "../components/Loading"
import UserChat from "../components/chats/UserChat"
import PotenialChat from "../components/chats/PotenialChat"
import ChatBox from "../components/chats/ChatBox"
import useMediaQuery from "../hooks/useMediaQuery"
import { useSelector } from "../lib/rtk/index"

export default function Chat() {
    const { userChats, updateCurrentChat, isUserChatsLoading } = useContext(ChatContext)    
    const user = useSelector(state => state.user)
    const [showChatBox, setShowChatBox] = useState(false);

    const isSmallScreen = useMediaQuery("(max-width: 1024px)")
    
    const handleChatClick = (chat) => {
        updateCurrentChat(chat);
        setShowChatBox(true);        
    };

    const handleCloseChat = () => {
        updateCurrentChat(null);
        setShowChatBox(false);
    };

    return (
        <Container className="h-100 d-flex flex-column gap-3 flex-grow-1">
            <PotenialChat showChatBox={showChatBox} />
            {
                isUserChatsLoading ? (<LoadingComponent />):
                userChats?.length < 1 ? null : (
                    <Stack gap={4} direction="horizontal" className={`${isSmallScreen ? "align-items-center w-100" : "align-items-start"} h-100 flex-grow-1`}>
                        <Stack 
                            className={`
                                ${(showChatBox && isSmallScreen) ? "d-none" : "messages-box flex-grow-1 pe-3"}
                                ${!isSmallScreen && "w-50"}
                            `} 
                            gap={3}
                        >
                            
                            {
                                userChats?.map((chat, i) => { 
                                    return (
                                        <div role="button" key={i} onClick={() => {handleChatClick(chat)}}>
                                            <UserChat chat={chat} user={user} />
                                        </div>
                                    )
                                })
                            }
                        </Stack>
                        {(!isSmallScreen || (isSmallScreen && showChatBox)) && <ChatBox handleCloseChat={handleCloseChat}/>}
                    </Stack>
                )
            }
        </Container>
    )
}