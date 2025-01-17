import User from "../../../models/user.model.js";
import { formatResponse } from "../../../utils/formatResponse.js";
import { httpStatus } from "../../../utils/httpStatusText.js";
import bcrypt from "bcryptjs"
import generateToken from "../../../utils/generateToken.js";
import { checkRequiredFields } from "../../../utils/checkRequiredFields.js"

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }, { __v: false });

        if (!checkRequiredFields(req, res, ['email', 'password'])) {
            return;
        }

        if (!user) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Email is invalid', 401));
        }
        
        const matchedPassword = await bcrypt.compare(password, user.password)
        
        if (!matchedPassword) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Password is invalid', 401));
        }

        if (user && matchedPassword) {
            const token = generateToken({ email: user.email, id: user._id });
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                phone: user.phone,
                friends: user.friends,
                friendRequests: user.friendRequests,
                media: user.media,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
            res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token }, 'User logined successfully', 200));
        }else {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Password is invalid', 401));
        }
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}