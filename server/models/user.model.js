import mongoose from "mongoose";
import validator from 'validator'
import mediaSchema from "./media.model.js";

const { isEmail } = validator

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 200,
            unique: true,
            validate: [isEmail, 'field must be a valid email']
        },
        password: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1024,
        },
        phone: {
            type: String,
            required: false,
        },
        gender: {
            type: String,
            required: false,
        },
        media: {
            type: mediaSchema,
            required: false,
        },
    },{
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

const User = mongoose.model('User', userSchema);

export default User;