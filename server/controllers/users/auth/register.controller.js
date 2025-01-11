import User from '../../../models/user.model.js'
import { formatResponse } from '../../../utils/formatResponse.js'
import { httpStatus } from '../../../utils/httpStatusText.js'
import generateToken from "../../../utils/generateToken.js"
import bcrypt from "bcryptjs"
import { checkRequiredFields } from "../../../utils/checkRequiredFields.js"
import { formatMediaFile } from "../../../utils/meidaFormatter.js"

export const registerController = async (req, res) => {
    try {
        const { name, email, password, c_password, phone, gender } = req.body

        if (!checkRequiredFields(req, res, ['name', 'email', 'password'])) {
            return;
        }

        if (password !== c_password) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "The passwords are not matched!", 401))
        }

        let oldUser = await User.findOne({ email },{"__v": false, "password": false})

        if (oldUser) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'User already exist!', 401))
        }

        let media = null

        if (req.file) {
            media = formatMediaFile(req.file)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            media
        })

        const token = generateToken({ email: newUser.email, id: newUser._id })
        newUser.token = token;

        await newUser.save()

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || "",
            gender: newUser.gender || "",
            media: newUser.media,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at,
        }
        
        res.status(201).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token: token }, 'User registered successfully', 201))
    } catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}