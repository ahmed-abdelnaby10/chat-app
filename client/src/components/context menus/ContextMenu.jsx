import PropTypes from "prop-types";

export default function CustomContextMenu({ contextMenu, closeContextMenu }) {
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
            >
                Close chat
            </button>
        </div>
    )
}

CustomContextMenu.propTypes = {
    contextMenu: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }).isRequired,
    closeContextMenu: PropTypes.func.isRequired,
};