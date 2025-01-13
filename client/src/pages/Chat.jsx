import { useContext, useState } from "react"
import ChatContext from "../contexts/ChatContext"
import { Button, Container, Stack } from "react-bootstrap"
import LoadingComponent from "../components/Loading"
import UserChat from "../components/chats/UserChat"
import PotenialChat from "../components/chats/PotenialChat"
import ChatBox from "../components/chats/ChatBox"
import useMediaQuery from "../hooks/useMediaQuery"
import { useSelector } from "../lib/rtk/index"
import ChatContextMenu from "../components/context menus/ChatContextMenu"

export default function Chat() {
    const { userChats, updateCurrentChat, currentChat, isUserChatsLoading, updateShowChatBox, showChatBox } = useContext(ChatContext)    
    const user = useSelector(state => state.user)
    
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    const [selectedChat, setSelectedChat] = useState(null)

    const isSmallScreen = useMediaQuery("(max-width: 1024px)")
    
    const handleChatClick = (chat) => {
        updateCurrentChat(chat);
        updateShowChatBox(true);
    };

    const handleCloseChat = () => {
        updateCurrentChat(null);
        updateShowChatBox(false);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX ,
            y: e.pageY ,
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0 })
    };

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);
    const handleClose = () => setShow(false);

    return (
        <Container className="h-100 d-flex flex-column gap-3 flex-grow-1">
            {
                isUserChatsLoading ? (<LoadingComponent />):
                // userChats?.length < 1 ? null : (
                    <Stack gap={4} direction="horizontal" className={`${isSmallScreen ? "align-items-center w-100" : "align-items-start"} h-100 flex-grow-1 position-relative`}>
                        <div 
                            className={`
                                ${(showChatBox && isSmallScreen) ? "d-none" : "flex-grow-1 d-flex flex-column"}
                                ${!isSmallScreen && "w-50"}
                                position-relative chats
                            `} 
                        >
                            {
                                !isSmallScreen ? (
                                    <Stack 
                                        direction="horizontal" 
                                        gap={3} 
                                        className="p-2 chats-header align-items-center justify-content-between"
                                    >
                                        <h4>Chats</h4>
                                        <Button 
                                            variant="primary"
                                            onClick={handleShow}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Button>
                                    </Stack>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        className="d-flex align-items-center justify-content-center position-absolute z-3 rounded-4 new-chat"
                                        onClick={handleShow}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            right: "0",
                                            bottom: "0"
                                        }}   
                                    >
                                        <i className="bi bi-plus position-absolute"></i>
                                        <i className="bi bi-chat-left position-absolute"></i>
                                    </Button>
                                )
                            }
                            <PotenialChat show={show} handleClose={handleClose}/>
                            {
                                !show && (
                                    <Stack 
                                        className='messages-box' 
                                        onClick={()=>{
                                            setContextMenu({ visible: false, x: 0, y: 0 })
                                        }}
                                        gap={1}
                                    >
                                        
                                        {
                                            userChats?.length > 0 ?
                                            userChats?.map((chat, i) => { 
                                                return (
                                                    <div 
                                                        role="button" 
                                                        className={`
                                                            user-card-container 
                                                            ${chat?._id === currentChat?._id && "selected"}
                                                        `} 
                                                        key={i} 
                                                        onClick={() => {
                                                            handleChatClick(chat)
                                                            setContextMenu({ visible: false, x: 0, y: 0 })
                                                        }}
                                                        onContextMenu={(e) => {
                                                            setSelectedChat(chat)
                                                            handleContextMenu(e)
                                                        }}
                                                    >
                                                        <UserChat chat={chat} user={user} />
                                                    </div>
                                                )
                                            }): (
                                                <p className="text-center mt-5">Pick up a new chat!</p>
                                            )
                                        }
                                    </Stack>
                                )
                            }
                        </div>
                        {(!isSmallScreen || (isSmallScreen && showChatBox)) && <ChatBox handleCloseChat={handleCloseChat}/>}
                    </Stack>
                // )
            }
            {
                (contextMenu.visible) && (
                    <ChatContextMenu contextMenu={contextMenu} closeContextMenu={closeContextMenu} selectedChat={selectedChat} />
                )
            }
        </Container>
    )
}