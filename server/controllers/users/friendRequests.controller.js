import mongoose from "mongoose";
import User from "../../models/user.model.js";
import { httpStatus } from "../../utils/httpStatusText.js";
import { formatResponse } from "../../utils/formatResponse.js";

export const sendFriendRequestController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Invalid userId or friendId.', 400));
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
        }

        if (!friend) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Friend not found.', 404));
        }

        if (friend.friendRequests?.received?.some(req => req?.user?.toString() === userId) || 
            user.friendRequests?.sent?.some(req => req?.user?.toString() === friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Friend request already sent.', 400));
        }

        if (friend.friends.includes(userId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'User is already a friend.', 400));
        }

        friend.friendRequests?.received.push({ user: userId });
        user.friendRequests?.sent.push({ user: friendId });
        await friend.save();
        await user.save();

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: user, friend: friend }, 'Friend request sent successfully.'));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const acceptFriendRequestController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Invalid userId or friendId.', 400));
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User or friend not found.', 404));
        }

        if (!user.friendRequests?.received?.some(req => req?.user.toString() === friendId) || 
            !friend.friendRequests?.sent?.some(req => req?.user.toString() === userId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'No friend request found from this user.', 400));
        }

        user.friendRequests.received = user.friendRequests?.received?.filter((req) => req?.user.toString() !== friendId);
        friend.friendRequests.sent = friend.friendRequests?.sent?.filter((req) => req?.user.toString() !== userId);

        user.friends.push(friendId);
        friend.friends.push(userId);

        await user.save();
        await friend.save();

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: user, friend: friend }, 'Friend request accepted.'));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const rejectFriendRequestController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Invalid userId or friendId.', 400));
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User or friend not found.', 404));
        }

        if (!user.friendRequests?.received.some(req => req?.user?.toString() === friendId) || 
            !friend.friendRequests?.sent.some(req => req?.user?.toString() === userId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'No friend request found from this user.', 400));
        }

        user.friendRequests.received = user.friendRequests?.received.filter((req) => req.user.toString() !== friendId);
        friend.friendRequests.sent = friend.friendRequests?.sent.filter((req) => req.user.toString() !== userId);
        await user.save();
        await friend.save();

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: user, friend: friend }, 'Friend request rejected.'));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const cancelFriendRequestController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'Invalid userId or friendId.', 400));
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
        }

        if (!friend) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Friend not found.', 404));
        }

        if (!friend.friendRequests?.received?.some(req => req?.user?.toString() === userId) || 
            !user.friendRequests?.sent?.some(req => req?.user?.toString() === friendId)) {
            return res.status(400).json(formatResponse(httpStatus.ERROR, null, 'No friend request found from this user.', 400));
        }

        friend.friendRequests.received = friend.friendRequests?.received?.filter((req) => req?.user?.toString() !== userId);
        user.friendRequests.sent = user.friendRequests?.sent?.filter((req) => req?.user?.toString() !== friendId);
        await friend.save();
        await user.save();

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: user, friend: friend }, 'Friend request canceled successfully.'));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};
