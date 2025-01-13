import PropTypes from "prop-types";
import { useContext } from "react";
import ChatContext from "../../contexts/ChatContext";

export default function MsgContextMenu({ contextMenu, closeContextMenu, selectedMessage }) {
    const { handleDeleteMessage } = useContext(ChatContext)
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
                    handleDeleteMessage(selectedMessage?._id)
                }}
            >
                Delete message
            </button>
        </div>
    )
}

MsgContextMenu.propTypes = {
    contextMenu: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    closeContextMenu: PropTypes.func.isRequired,
    selectedMessage: PropTypes.any
};