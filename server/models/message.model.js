import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true 
        },
        senderId: String,
        text: String,
        edited: {
            type: Boolean,
            default: false
        },
        reacted: {
            type: Boolean,
            default: false
        },
    },{
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

const Message = mongoose.model('Message', messageSchema);

export default Message;