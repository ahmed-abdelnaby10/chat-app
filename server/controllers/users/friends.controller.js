import mongoose from "mongoose";
import User from "../../models/user.model.js";
import { httpStatus } from "../../utils/httpStatusText.js";
import { formatResponse } from "../../utils/formatResponse.js";

export const removeFriendController = async (req, res) => {
    try {
        const { userId } = req.params
        const { friendId } = req.body        

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Invalid userId or friendId.', 400));
        }

        const user = await User.findById(userId)
        const friend = await User.findById(friendId)

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
        }

        if (!friend) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Friend not found.', 404));
        }

        const friendExists = user.friends?.some((id) => id.toString() === friendId) || friend.friends?.some((id) => id.toString() === userId);

        if (!friendExists) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Friend does not exist in user\'s friends list.', 400));
        }

        user.friends = user.friends?.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends?.filter((id) => id.toString() !== userId);
        await user.save();
        await friend.save();

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: user, friend: friend }, 'Friend removed successfully.'));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}