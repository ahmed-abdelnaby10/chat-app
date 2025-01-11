import PropTypes from "prop-types";

export const chatPropType = PropTypes.shape({
        _id: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired
})