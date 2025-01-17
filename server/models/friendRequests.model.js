import mongoose, { Schema } from "mongoose";

const friendRequestEntrySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: false
});

const friendRequestsSchema = new Schema({
    sent: {
        type: [friendRequestEntrySchema],
        default: [],
    },
    received: {
        type: [friendRequestEntrySchema],
        default: [],
    },
}, {
    _id: false,
    timestamps: false
});

export default friendRequestsSchema;