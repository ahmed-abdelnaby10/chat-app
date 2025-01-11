import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: Array
    },{
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;