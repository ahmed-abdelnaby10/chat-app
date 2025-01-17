import PropTypes from "prop-types";

export const userPropType = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    gender: PropTypes.string,
    phone: PropTypes.string,
    media: PropTypes.any,
    friends: PropTypes.any,
    friendRequests: PropTypes.any,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired
})