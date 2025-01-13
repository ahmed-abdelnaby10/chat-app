import PropTypes from "prop-types";
import { useContext } from "react";
import ChatContext from "../../contexts/ChatContext";

export default function ChatContextMenu({ contextMenu, closeContextMenu, selectedChat }) {
    const { handleDeleteChat } = useContext(ChatContext)
    return (
        <div 
            className="context-menu"
            style={{
                top: contextMenu.y,
                left: contextMenu.x
            }}
            onClick={()=> {
                closeContextMenu()
            }} 
        >
            <i className="bi bi-x text-danger"></i>
            <button
                style={{
                    whiteSpace: "nowrap"
                }}
                onClick={()=>{
                    handleDeleteChat(selectedChat?._id)
                }}
            >
                Delete chat
            </button>
        </div>
    )
}

ChatContextMenu.propTypes = {
    contextMenu: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    closeContextMenu: PropTypes.func.isRequired,
    selectedChat: PropTypes.any
};