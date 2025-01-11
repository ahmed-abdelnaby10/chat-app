import { formatResponse } from "../../utils/formatResponse.js";
import { httpStatus } from "../../utils/httpStatusText.js";
import mongoose from "mongoose";
import User from "../../models/user.model.js";

export const getAllUsersController = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        const users = await User.find().select('-__v -password')
        
        res.status(200).json(formatResponse(
            httpStatus.SUCCESS, 
            { 
                users,
                total_users: totalUsers,
            },
            "Users featched successfully!",
            200
        ));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const getOneUser = async (req, res) => {
    const userId = req.params.userId

    if (userId) {
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
        }

        const user = await User.findById(userId).select('-__v -password');
        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
        }
        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user }, 'User fetched successfully.', 200));
    }
}