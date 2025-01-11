import User from "../../models/user.model.js";
import { formatResponse } from "../../utils/formatResponse.js";
import { httpStatus } from "../../utils/httpStatusText.js";
import { checkRequiredFields } from "../../utils/checkRequiredFields.js";
import bcrypt from "bcryptjs";
import { formatMediaFile } from "../../utils/meidaFormatter.js"

export const updateUserController = async (req, res) => {
    try {
        const userId = req.params.userId;

        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {$set: {
            ...req.body,
            ...(media && { media })   
        }},
            { new: true }
        ).select("-password -__v");

        res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "User updated successfully", 200));

    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { oldPassword, newPassword, c_password } = req.body;

        const user = await User.findById(userId).select("+password");

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "User not found!", 404));
        }

        if (!checkRequiredFields(req, res, ['oldPassword', 'newPassword', 'c_password'])) {
            return;
        }

        const matchedPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchedPassword) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "Old password is invalid", 401));
        }

        if (newPassword !== c_password) {
            return res.status(400).json(formatResponse(httpStatus.FAIL, null, "Passwords do not match", 400));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, fields: { password: 0, __v: 0 } }
        );

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "Password changed successfully", 200));

    } catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const deleteUserController = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'User deleted successfullly', 200));
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};